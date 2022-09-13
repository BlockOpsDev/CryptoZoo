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

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../ERC20Issuable/ERC20Issuable.sol";

import "./swap-utils/CalcSwap.sol";
import "../../ERC20Issuable/interfaces/IERC20Issuer.sol";

abstract contract SwapIssuer is CalcSwap, IERC20Issuer {
  ERC20Issuable public immutable issueToken;
  IERC20 public immutable reserveToken;

  uint32 private immutable _reserveRatio;
  uint256 private _virtualReserveBalance;

  event Issue(address reciever, uint256 amount, uint256 deposit);
  event Redeem(address reciever, uint256 amount, uint256 refund);

  /**
   * @notice Initialize Swap Issuer
   *
   * @param reserveRatio    reserve ratio, represented in ppm, 1-1000000
   * @param minReserve      the minimum amount of reserve token required to init
   * @param reserveToken    token collected as reserves in exchange for issued token
   * @param issueToken      the token being issued in exchange for reserve token
   *
   */
  struct SwapIssuerParams {
    uint32 reserveRatio;
    uint256 minReserve;
    IERC20 reserveToken;
    ERC20Issuable issueToken;
  }

  constructor(SwapIssuerParams memory swapIssuerParams) {
    //Initialize AnalyticMath constants
    init();

    _virtualReserveBalance = swapIssuerParams.minReserve;
    _reserveRatio = swapIssuerParams.reserveRatio;
    issueToken = swapIssuerParams.issueToken;
    reserveToken = swapIssuerParams.reserveToken;
  }

  /**
   * @notice Get Reserve Ratio
   *
   * @return _reserveRatio The Reserve Ratio used for swap math
   */
  function reserveRatio() public view virtual override returns (uint32) {
    return _reserveRatio;
  }

  /**
   * @notice Get Virtual Reserve Balance
   *
   * @return _virtualReserveBalance  The Reserve token balance used for swap math
   */
  function virtualReserveBalance() public view virtual override returns (uint256) {
    return _virtualReserveBalance;
  }

  /**
   * @notice Get Virtual Supply
   *
   * @return supply  The Supply used for swap math
   */
  function virtualSupply() public view virtual override returns (uint256) {
    return totalSupplyIssued();
  }

  /**
   * @dev Update _virtualReserveBalance and emit Issue event
   */
  function _issued(
    address account,
    uint256 amount,
    uint256 deposit
  ) internal {
    _virtualReserveBalance += deposit;
    emit Issue(account, amount, deposit);
  }

  /**
   * @dev Update _virtualReserveBalance and emit Redeem event
   */
  function _redeemed(
    address account,
    uint256 amount,
    uint256 refund
  ) internal {
    _virtualReserveBalance -= refund;
    emit Redeem(account, amount, refund);
  }

  /**
   * @dev Method that returns the amount of tokens currently issued
   */
  function totalSupplyIssued() public view virtual returns (uint256);

  /**
   * @dev Method that returns reserve token balance
   */
  function reserveBalance() public view virtual returns (uint256);

  /**
   * @dev Method that returns the minimum balance required in reserveBalance()
   */
  function minimumReserveRequired() public view virtual returns (uint256);
}
