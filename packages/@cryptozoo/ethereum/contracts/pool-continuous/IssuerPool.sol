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

import "@balancer-labs/ethereum/contracts/solidity-utils/helpers/InputHelpers.sol";

import "./BalancerSwapIssuer.sol";

import "./helpers/IssuerPoolUserData.sol";
import "./helpers/ERC20Helpers.sol";

import "../ERC20ManagedSupply/ERC20ManagedSupply.sol";

abstract contract IssuerPool is BalancerSwapIssuer {
  using IssuerPoolUserData for bytes;

  uint8 private constant _MINIMUM_RESERVE = 1;
  uint256 private constant _INITIAL_ISSUE_SUPPLY = 2**(112) - 1;

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

  constructor(
    PoolParams memory poolParams,
    uint32 reserveRatio,
    address reserveToken,
    address issueToken
  )
    ConstantReserveRatioIssuer(reserveRatio, _MINIMUM_RESERVE, IERC20(reserveToken), ERC20ManagedSupply(issueToken))
    BasePool(
      poolParams.vault,
      IVault.PoolSpecialization.TWO_TOKEN,
      _sortTokens(IERC20(reserveToken), IERC20(issueToken)),
      poolParams.assetManagers,
      poolParams.swapFeePercentage,
      poolParams.pauseWindowDuration,
      poolParams.bufferPeriodDuration,
      poolParams.owner
    )
  {
    (uint256 reserveIndex, uint256 issueIndex) = _getSortedTokenIndexes(IERC20(reserveToken), IERC20(issueToken));
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

  function _getTotalTokens() internal pure override returns (uint256) {
    return 2;
  }

  function _getMaxTokens() internal pure override returns (uint256) {
    return 2;
  }

  function reserveBalance() public view virtual override returns (uint256) {
    uint256[] memory balances;
    (, balances, ) = getVault().getPoolTokens(getPoolId());
    return balances[_reserveIndex];
  }

  function minimumReserveRequired() public view virtual override returns (uint256) {
    return 0;
  }

  function managedSupply() public view virtual override returns (uint256) {
    uint256[] memory balances;
    (, balances, ) = getVault().getPoolTokens(getPoolId());
    return _INITIAL_ISSUE_SUPPLY - balances[_issueIndex];
  }

  function initialize(uint256 supply) external {
    bytes32 poolId = getPoolId();
    (IERC20[] memory tokens, , ) = getVault().getPoolTokens(poolId);

    uint256[] memory maxAmountsIn = new uint256[](_getTotalTokens());
    maxAmountsIn[_issueIndex] = _INITIAL_ISSUE_SUPPLY;

    IVault.JoinPoolRequest memory request = IVault.JoinPoolRequest({
      assets: _asIAsset(tokens),
      maxAmountsIn: maxAmountsIn,
      userData: abi.encode(IssuerPoolUserData.JoinKind.INIT_PHANTOM_SUPPLY, _INITIAL_ISSUE_SUPPLY, supply),
      fromInternalBalance: false
    });

    getVault().joinPool(poolId, address(this), address(this), request);
  }

  //Implement Base Pool Handlers

  function _onJoinPool(
    bytes32,
    address sender,
    address recipient,
    uint256[] memory,
    uint256,
    uint256,
    bytes memory userData
  ) internal override returns (uint256[] memory) {
    // _require(managedSupply() == 0, Errors.UNHANDLED_JOIN_KIND);
    IssuerPoolUserData.JoinKind kind = userData.joinKind();

    _require(
      kind == IssuerPoolUserData.JoinKind.INIT_PHANTOM_SUPPLY && sender == address(this) && recipient == address(this),
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
    _require(sender == getOwner(), Errors.UNHANDLED_EXIT_KIND);

    _beforeJoinExit(balances, protocolSwapFeePercentage);

    uint256[] memory amountsOut = new uint256[](balances.length);
    amountsOut[_reserveIndex] = 1e18;

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
