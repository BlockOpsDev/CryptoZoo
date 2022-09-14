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

import "../solidity-utils/helpers/InputHelpers.sol";

import "./helpers/PoolUserData.sol";
import "./helpers/ERC20Helpers.sol";

import "../ERC20Issuable/ERC20Issuable.sol";

import "./IssuerPool.sol";

/**
 * @title Continuous Token Offering Pool
 * @notice A Balancer Pool that can Issue and redeem tokens in exchange for a reserve token
 *
 * @dev Issue and Redeem tokens based Constant Reserve Ratio Math to continuously
 * offer tokens through the Balancer ecosystem
 */
abstract contract ContinuousTokenOfferingPool is IssuerPool {
  using PoolUserData for bytes;

  uint256 private constant _INITIAL_ISSUE_SUPPLY = 2**(112) - 1;

  /**
   * @dev Pool token array indexes after sorting
   */
  uint256 private immutable _issueIndex;
  uint256 private immutable _reserveIndex;

  struct PoolParams {
    IVault vault;
    address[] assetManagers;
    uint256 swapFeePercentage;
    uint256 pauseWindowDuration;
    uint256 bufferPeriodDuration;
    address owner;
  }

  /**
   * @notice Initialize Continuous Token Offering Pool
   *
   * @param poolParams          Pool initialization parameters (see BasePool.sol)
   * @param swapIssuerParams    Swap Issuer initialization parameters (see SwapIssuer.sol)
   */
  constructor(PoolParams memory poolParams, SwapIssuerParams memory swapIssuerParams)
    BasePool(
      poolParams.vault,
      IVault.PoolSpecialization.TWO_TOKEN,
      _sortTokens(swapIssuerParams.reserveToken, swapIssuerParams.issueToken),
      poolParams.assetManagers,
      poolParams.swapFeePercentage,
      poolParams.pauseWindowDuration,
      poolParams.bufferPeriodDuration,
      poolParams.owner
    )
    SwapIssuer(swapIssuerParams)
  {
    (uint256 reserveIndex, uint256 issueIndex) = _getSortedTokenIndexes(
      swapIssuerParams.reserveToken,
      swapIssuerParams.issueToken
    );

    _reserveIndex = reserveIndex;
    _issueIndex = issueIndex;
  }

  /**
   * @notice Return the index of the reserve token.
   * @dev Note that this is an index into the registered token list (with 2 tokens).
   */
  function getReserveIndex() external view returns (uint256) {
    return _reserveIndex;
  }

  /**
   * @notice Return the index of the issue token.
   * @dev Note that this is an index into the registered token list (with 2 tokens).
   */
  function getissueIndex() public view returns (uint256) {
    return _issueIndex;
  }

  /**
   * @notice Number of Tokens in the pool
   * @dev The Continuous Token Offering Pool is strictly a two token pool
   */
  function _getTotalTokens() internal pure override returns (uint256) {
    return 2;
  }

  function _getMaxTokens() internal pure override returns (uint256) {
    return 2;
  }

  /**
   * @notice Total supply of tokens issued by the pool.
   *
   * @dev totalSupply() of the issueToken (ERC20Issuable).
   * Supply Issued = Initial Supply balance - Current Supply balance
   */
  function totalSupplyIssued() public view virtual override returns (uint256) {
    uint256[] memory balances;
    (, balances, ) = getVault().getPoolTokens(getPoolId());
    return _INITIAL_ISSUE_SUPPLY - balances[_issueIndex];
  }

  /**
   * @notice Reserve token balance.
   * @dev Gets the pool's balance from the vault
   */
  function reserveBalance() public view virtual override returns (uint256) {
    uint256[] memory balances;
    (, balances, ) = getVault().getPoolTokens(getPoolId());
    return balances[_reserveIndex];
  }

  /**
   * @notice Initilize the pool with tokens
   *
   * @param supply initial supply at the minimum reserve balance
   *
   * @dev The initial supply acts as a scaling factor for how the token is issued
   */
  function initialize(uint256 supply) external {
    bytes32 poolId = getPoolId();
    (IERC20[] memory tokens, , ) = getVault().getPoolTokens(poolId);

    uint256[] memory maxAmountsIn = new uint256[](_getTotalTokens());
    maxAmountsIn[_issueIndex] = _INITIAL_ISSUE_SUPPLY;

    IVault.JoinPoolRequest memory request = IVault.JoinPoolRequest({
      assets: _asIAsset(tokens),
      maxAmountsIn: maxAmountsIn,
      userData: abi.encode(PoolUserData.JoinKind.INIT_PHANTOM_SUPPLY, _INITIAL_ISSUE_SUPPLY, supply),
      fromInternalBalance: false
    });

    getVault().joinPool(poolId, address(this), address(this), request);
  }

  //Implement Base Pool Handlers

  /**
   * @notice Called by onJoinPool Hook.
   *
   * @dev Mint phantom issue tokens and send to the Balancer vault
   * Can only run one time, when the pool is being initialized
   */
  function _onJoinPool(
    bytes32,
    address sender,
    address recipient,
    uint256[] memory balances,
    uint256,
    uint256,
    bytes memory userData
  ) internal override returns (uint256[] memory) {
    _require(balances[0] == 0 && balances[1] == 0, Errors.UNAUTHORIZED_JOIN);

    PoolUserData.JoinKind kind = userData.joinKind();

    _require(
      kind == PoolUserData.JoinKind.INIT_PHANTOM_SUPPLY && sender == address(this) && recipient == address(this),
      Errors.INVALID_INITIALIZATION
    );

    (, uint256 startSupply) = userData.initialAmounts();

    issueToken.mint(sender, _INITIAL_ISSUE_SUPPLY);
    issueToken.approve(address(getVault()), _INITIAL_ISSUE_SUPPLY - startSupply);

    uint256[] memory amountsIn = new uint256[](_getTotalTokens());
    amountsIn[_issueIndex] = _INITIAL_ISSUE_SUPPLY - startSupply;

    return (amountsIn);
  }

  function _onExitPool(
    bytes32,
    address sender,
    address,
    uint256[] memory balances,
    uint256,
    uint256 protocolSwapFeePercentage,
    bytes memory userData
  ) internal virtual override returns (uint256[] memory) {
    _require(sender == getOwner(), Errors.UNAUTHORIZED_EXIT);

    _beforeJoinExit(balances, protocolSwapFeePercentage);

    PoolUserData.ExitKind kind = userData.exitKind();

    uint256[] memory amountsOut = new uint256[](balances.length);

    if (kind == PoolUserData.ExitKind.WITHDRAW_MAX) {
      //Withdraw all of the available balance
      uint256 withdrawableBalance = balances[_reserveIndex] - minimumReserveRequired();

      amountsOut[_reserveIndex] = withdrawableBalance;
    } else if (kind == PoolUserData.ExitKind.WITHDRAW_EXACT) {
      //Withdraw an exact amount of the available balance
      uint256 withdrawableBalance = balances[_reserveIndex] - minimumReserveRequired();
      uint256 withdrawAmount = userData.exactReserveWithdraw();

      _require(withdrawAmount <= withdrawableBalance, Errors.INSUFFICIENT_BALANCE);

      amountsOut[_reserveIndex] = withdrawAmount;
    } else if (kind == PoolUserData.ExitKind.REMOVE) {
      //Withdraw entire reserves, Used for migrating reserves
      amountsOut[_reserveIndex] = balances[_reserveIndex];
    } else {
      _revert(Errors.UNHANDLED_EXIT_KIND);
    }

    _afterJoinExit(false, balances, amountsOut);

    return (amountsOut);
  }

  //Hooks
  /**
   * @dev Called before any join or exit operation. Empty by default, but derived contracts may choose to add custom
   * behavior at these steps. This often has to do with protocol fee processing.
   */
  function _beforeJoinExit(uint256[] memory preBalances, uint256 protocolSwapFeePercentage) internal virtual {
    // solhint-disable-previous-line no-empty-blocks
  }

  /**
   * @dev Called after any join or exit operation (including initialization). Empty by default, but derived contracts
   * may choose to add custom behavior at these steps. This often has to do with protocol fee processing.
   *
   * If isJoin is true, balanceDeltas are the amounts in: otherwise they are the amounts out.
   *
   * This function is free to mutate the `preBalances` array.
   */
  function _afterJoinExit(
    bool isJoin,
    uint256[] memory preBalances,
    uint256[] memory balanceDeltas
  ) internal virtual {
    // solhint-disable-previous-line no-empty-blocks
  }
}
