// SPDX-License-Identifier: GPL-3.0-or-later
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@balancer-labs/ethereum/contracts/solidity-utils/math/FixedPoint.sol";
import "@balancer-labs/ethereum/contracts/solidity-utils/helpers/InputHelpers.sol";
import "@balancer-labs/ethereum/contracts/solidity-utils/helpers/TemporarilyPausable.sol";
import "@balancer-labs/ethereum/contracts/solidity-utils/helpers/WordCodec.sol";

import "@balancer-labs/ethereum/contracts/interfaces/vault/IVault.sol";
// import "@balancer-labs/v2-asset-manager-utils/contracts/IAssetManager.sol";

import "./BasePoolAuthorization.sol";
import "./interfaces/IBasePool.sol";

// solhint-disable max-states-count

/**
 * @dev Reference implementation for the base layer of a Pool contract that manages a single Pool with optional
 * Asset Managers, an admin-controlled swap fee percentage, and an emergency pause mechanism.
 *
 * Note that neither swap fees nor the pause mechanism are used by this contract. They are passed through so that
 * derived contracts can use them via the `_addSwapFeeAmount` and `_subtractSwapFeeAmount` functions, and the
 * `whenNotPaused` modifier.
 *
 * No admin permissions are checked here: instead, this contract delegates that to the Vault's own Authorizer.
 *
 * Because this contract doesn't implement the swap hooks, derived contracts should generally inherit from
 * BaseGeneralPool or BaseMinimalSwapInfoPool. Otherwise, subclasses must inherit from the corresponding interfaces
 * and implement the swap callbacks themselves.
 */
abstract contract BasePool is IBasePool, BasePoolAuthorization, TemporarilyPausable {
  using WordCodec for bytes32;
  using FixedPoint for uint256;

  uint256 private constant _MIN_TOKENS = 2;

  // 1e18 corresponds to 1.0, or a 100% fee
  uint256 private constant _MIN_SWAP_FEE_PERCENTAGE = 1e12; // 0.0001%
  uint256 private constant _MAX_SWAP_FEE_PERCENTAGE = 1e17; // 10% - this fits in 64 bits

  uint256 private constant _MINIMUM_BPT = 1e6;

  // Storage slot that can be used to store unrelated pieces of information. In particular, by default is used
  // to store only the swap fee percentage of a pool. But it can be extended to store some more pieces of information.
  // The swap fee percentage is stored in the most-significant 64 bits, therefore the remaining 192 bits can be
  // used to store any other piece of information.
  bytes32 private _miscData;
  uint256 private constant _SWAP_FEE_PERCENTAGE_OFFSET = 192;
  uint256 private constant _SWAP_FEE_PERCENTAGE_BIT_LENGTH = 64;

  IVault private immutable _vault;
  bytes32 private immutable _poolId;

  // Note that this value is immutable in the Vault, so we can make it immutable here and save gas
  IProtocolFeesCollector private immutable _protocolFeesCollector;

  event SwapFeePercentageChanged(uint256 swapFeePercentage);

  constructor(
    IVault vault,
    IVault.PoolSpecialization specialization,
    IERC20[] memory tokens,
    address[] memory assetManagers,
    uint256 swapFeePercentage,
    uint256 pauseWindowDuration,
    uint256 bufferPeriodDuration,
    address owner
  )
    Authentication(bytes32(uint256(uint160(msg.sender))))
    BasePoolAuthorization(owner)
    TemporarilyPausable(pauseWindowDuration, bufferPeriodDuration)
  {
    _require(tokens.length >= _MIN_TOKENS, Errors.MIN_TOKENS);
    _require(tokens.length <= _getMaxTokens(), Errors.MAX_TOKENS);

    // The Vault only requires the token list to be ordered for the Two Token Pools specialization. However,
    // to make the developer experience consistent, we are requiring this condition for all the native pools.
    // Also, since these Pools will register tokens only once, we can ensure the Pool tokens will follow the same
    // order. We rely on this property to make Pools simpler to write, as it lets us assume that the
    // order of token-specific parameters (such as token weights) will not change.
    InputHelpers.ensureArrayIsSorted(tokens);

    _setSwapFeePercentage(swapFeePercentage);

    bytes32 poolId = vault.registerPool(specialization);

    vault.registerTokens(poolId, tokens, assetManagers);

    // Set immutable state variables - these cannot be read from during construction
    _vault = vault;
    _poolId = poolId;
    _protocolFeesCollector = vault.getProtocolFeesCollector();
  }

  // Getters / Setters

  function getVault() public view override returns (IVault) {
    return _vault;
  }

  function getPoolId() public view override returns (bytes32) {
    return _poolId;
  }

  function _getTotalTokens() internal view virtual returns (uint256);

  function _getMaxTokens() internal pure virtual returns (uint256);

  function _getMinSwapFeePercentage() internal pure virtual returns (uint256) {
    return _MIN_SWAP_FEE_PERCENTAGE;
  }

  function _getMaxSwapFeePercentage() internal pure virtual returns (uint256) {
    return _MAX_SWAP_FEE_PERCENTAGE;
  }

  /**
   * @notice Return the current value of the swap fee percentage.
   * @dev This is stored in `_miscData`.
   */
  function getSwapFeePercentage() public view virtual override returns (uint256) {
    return _miscData.decodeUint(_SWAP_FEE_PERCENTAGE_OFFSET, _SWAP_FEE_PERCENTAGE_BIT_LENGTH);
  }

  /**
   * @notice Return the ProtocolFeesCollector contract.
   * @dev This is immutable, and retrieved from the Vault on construction. (It is also immutable in the Vault.)
   */
  function getProtocolFeesCollector() public view returns (IProtocolFeesCollector) {
    return _protocolFeesCollector;
  }

  /**
   * @notice Set the swap fee percentage.
   * @dev This is a permissioned function, and disabled if the pool is paused. The swap fee must be within the
   * bounds set by MIN_SWAP_FEE_PERCENTAGE/MAX_SWAP_FEE_PERCENTAGE. Emits the SwapFeePercentageChanged event.
   */
  function setSwapFeePercentage(uint256 swapFeePercentage) external virtual authenticate whenNotPaused {
    _setSwapFeePercentage(swapFeePercentage);
  }

  function _setSwapFeePercentage(uint256 swapFeePercentage) private {
    _require(swapFeePercentage >= _MIN_SWAP_FEE_PERCENTAGE, Errors.MIN_SWAP_FEE_PERCENTAGE);
    _require(swapFeePercentage <= _MAX_SWAP_FEE_PERCENTAGE, Errors.MAX_SWAP_FEE_PERCENTAGE);

    _miscData = _miscData.insertUint(swapFeePercentage, _SWAP_FEE_PERCENTAGE_OFFSET, _SWAP_FEE_PERCENTAGE_BIT_LENGTH);
    emit SwapFeePercentageChanged(swapFeePercentage);
  }

  // function setAssetManagerPoolConfig(IERC20 token, bytes memory poolConfig) public virtual authenticate whenNotPaused {
  //   _setAssetManagerPoolConfig(token, poolConfig);
  // }

  // function _setAssetManagerPoolConfig(IERC20 token, bytes memory poolConfig) private {
  //   bytes32 poolId = getPoolId();
  //   (, , , address assetManager) = getVault().getPoolTokenInfo(poolId, token);

  //   IAssetManager(assetManager).setConfig(poolId, poolConfig);
  // }

  /**
   * @notice Pause the pool: an emergency action which disables all pool functions.
   * @dev This is a permissioned function that will only work during the Pause Window set during pool factory
   * deployment (see `TemporarilyPausable`).
   */
  function pause() external authenticate {
    _setPaused(true);
  }

  /**
   * @notice Reverse a `pause` operation, and restore a pool to normal functionality.
   * @dev This is a permissioned function that will only work on a paused pool within the Buffer Period set during
   * pool factory deployment (see `TemporarilyPausable`). Note that any paused pools will automatically unpause
   * after the Buffer Period expires.
   */
  function unpause() external authenticate {
    _setPaused(false);
  }

  function _isOwnerOnlyAction(bytes32 actionId) internal view virtual override returns (bool) {
    return (actionId == getActionId(this.setSwapFeePercentage.selector));
    // ||
    // (actionId == getActionId(this.setAssetManagerPoolConfig.selector));
  }

  function _getMiscData() internal view returns (bytes32) {
    return _miscData;
  }

  /**
   * Inserts data into the least-significant 192 bits of the misc data storage slot.
   * Note that the remaining 64 bits are used for the swap fee percentage and cannot be overloaded.
   */
  function _setMiscData(bytes32 newData) internal {
    _miscData = _miscData.insertBits192(newData, 0);
  }

  // Join / Exit Hooks

  modifier onlyVault(bytes32 poolId) {
    _require(msg.sender == address(getVault()), Errors.CALLER_NOT_VAULT);
    _require(poolId == getPoolId(), Errors.INVALID_POOL_ID);
    _;
  }

  function onJoinPool(
    bytes32 poolId,
    address sender,
    address recipient,
    uint256[] memory balances,
    uint256 lastChangeBlock,
    uint256 protocolSwapFeePercentage,
    bytes memory userData
  ) public virtual override onlyVault(poolId) returns (uint256[] memory, uint256[] memory) {
    _beforeSwapJoinExit();

    uint256[] memory amountsIn = _onJoinPool(
      poolId,
      sender,
      recipient,
      balances,
      lastChangeBlock,
      protocolSwapFeePercentage,
      userData
    );

    return (amountsIn, new uint256[](balances.length));
  }

  function onExitPool(
    bytes32 poolId,
    address sender,
    address recipient,
    uint256[] memory balances,
    uint256 lastChangeBlock,
    uint256 protocolSwapFeePercentage,
    bytes memory userData
  ) public virtual override onlyVault(poolId) returns (uint256[] memory, uint256[] memory) {
    _beforeSwapJoinExit();

    uint256[] memory amountsOut = _onExitPool(
      poolId,
      sender,
      recipient,
      balances,
      lastChangeBlock,
      protocolSwapFeePercentage,
      userData
    );

    return (amountsOut, new uint256[](balances.length));
  }

  /**
   * @dev Called whenever the Pool is joined after the first initialization join (see `_onInitializePool`).
   *
   * Returns the amount of BPT to mint, the token amounts that the Pool will receive in return, and the number of
   * tokens to pay in protocol swap fees.
   *
   * Implementations of this function might choose to mutate the `balances` array to save gas (e.g. when
   * performing intermediate calculations, such as subtraction of due protocol fees). This can be done safely.
   *
   * Minted BPT will be sent to `recipient`.
   *
   * The tokens granted to the Pool will be transferred from `sender`. These amounts are considered upscaled and will
   * be downscaled (rounding up) before being returned to the Vault.
   *
   * Due protocol swap fees will be taken from the Pool's balance in the Vault (see `IBasePool.onJoinPool`). These
   * amounts are considered upscaled and will be downscaled (rounding down) before being returned to the Vault.
   */
  function _onJoinPool(
    bytes32 poolId,
    address sender,
    address recipient,
    uint256[] memory balances,
    uint256 lastChangeBlock,
    uint256 protocolSwapFeePercentage,
    bytes memory userData
  ) internal virtual returns (uint256[] memory amountsIn);

  /**
   * @dev Called whenever the Pool is exited.
   *
   * Returns the amount of BPT to burn, the token amounts for each Pool token that the Pool will grant in return, and
   * the number of tokens to pay in protocol swap fees.
   *
   * Implementations of this function might choose to mutate the `balances` array to save gas (e.g. when
   * performing intermediate calculations, such as subtraction of due protocol fees). This can be done safely.
   *
   * BPT will be burnt from `sender`.
   *
   * The Pool will grant tokens to `recipient`. These amounts are considered upscaled and will be downscaled
   * (rounding down) before being returned to the Vault.
   *
   * Due protocol swap fees will be taken from the Pool's balance in the Vault (see `IBasePool.onExitPool`). These
   * amounts are considered upscaled and will be downscaled (rounding down) before being returned to the Vault.
   */
  function _onExitPool(
    bytes32 poolId,
    address sender,
    address recipient,
    uint256[] memory balances,
    uint256 lastChangeBlock,
    uint256 protocolSwapFeePercentage,
    bytes memory userData
  ) internal virtual returns (uint256[] memory amountsOut);

  /**
   * @dev Called at the very beginning of swaps, joins and exits, even before the scaling factors are read. Derived
   * contracts can extend this implementation to perform any state-changing operations they might need (including e.g.
   * updating the scaling factors),
   *
   * The only scenario in which this function is not called is during a recovery mode exit. This makes it safe to
   * perform non-trivial computations or interact with external dependencies here, as recovery mode will not be
   * affected.
   *
   * Since this contract does not implement swaps, derived contracts must also make sure this function is called on
   * swap handlers.
   */
  function _beforeSwapJoinExit() internal virtual {
    // All joins, exits and swaps are disabled.
    _ensureNotPaused();
  }

  // Internal functions

  /**
   * @dev Pays protocol fees by minting `bptAmount` to the Protocol Fee Collector.
   */
  function _payProtocolFees(uint256 bptAmount) internal {
    // _mintPoolTokens(address(getProtocolFeesCollector()), bptAmount);
  }

  /**
   * @dev Adds swap fee amount to `amount`, returning a higher value.
   */
  function _addSwapFeeAmount(uint256 amount) internal view returns (uint256) {
    // This returns amount + fee amount, so we round up (favoring a higher fee amount).
    return amount.divUp(FixedPoint.ONE.sub(getSwapFeePercentage()));
  }

  /**
   * @dev Subtracts swap fee amount from `amount`, returning a lower value.
   */
  function _subtractSwapFeeAmount(uint256 amount) internal view returns (uint256) {
    // This returns amount - fee amount, so we round up (favoring a higher fee amount).
    uint256 feeAmount = amount.mulUp(getSwapFeePercentage());
    return amount.sub(feeAmount);
  }

  function _getAuthorizer() internal view override returns (IAuthorizer) {
    // Access control management is delegated to the Vault's Authorizer. This lets Balancer Governance manage which
    // accounts can call permissioned functions: for example, to perform emergency pauses.
    // If the owner is delegated, then *all* permissioned functions, including `setSwapFeePercentage`, will be under
    // Governance control.
    return getVault().getAuthorizer();
  }
}
