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

pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../ContinuousToken.sol";

contract MockContinuousToken is ContinuousToken {
  IERC20 private _reserveToken;

  constructor(IERC20 reserveToken, TokenParams memory tokenParams) ContinuousToken(tokenParams) {
    _reserveToken = reserveToken;
  }

  function reserveBalance() public view virtual override returns (uint256) {
    return _reserveToken.balanceOf(address(this));
  }

  //Testing Functions for Mint & Burn Functionality

  function continuousMintIn(uint256 deposit) external {
    uint256 amount = getContinuousSwap(bondSwapKind.MINT_GIVIN_IN, deposit);
    _mint(msg.sender, amount);
    _reserveToken.transferFrom(msg.sender, address(this), deposit);
    _continuousMinted(msg.sender, amount, deposit);
  }

  function continuousMintOut(uint256 request) external {
    uint256 deposit = getContinuousSwap(bondSwapKind.MINT_GIVIN_OUT, request);
    _mint(msg.sender, request);
    _reserveToken.transferFrom(msg.sender, address(this), deposit);
    _continuousMinted(msg.sender, request, deposit);
  }

  function continuousBurnIn(uint256 deposit) external {
    uint256 amount = getContinuousSwap(bondSwapKind.BURN_GIVIN_IN, deposit);
    _burn(msg.sender, deposit);
    _reserveToken.transferFrom(msg.sender, address(this), amount);
    _continuousBurned(msg.sender, deposit, amount);
  }

  //Testing Functions for Curve Math

  function math_continuousMintIn(
    uint256 reserveRatio,
    uint256 supply,
    uint256 reserve,
    uint256 deposit
  ) external view returns (uint256 amount) {
    amount = calculatePurchaseReturn(supply, reserve, reserveRatio, deposit);
  }

  function math_continuousMintOut(
    uint256 reserveRatio,
    uint256 supply,
    uint256 reserve,
    uint256 request
  ) external view returns (uint256 deposit) {
    deposit = calculatePurchasePrice(supply, reserve, reserveRatio, request);
  }

  function math_continuousBurnIn(
    uint256 reserveRatio,
    uint256 supply,
    uint256 reserve,
    uint256 deposit
  ) external view returns (uint256 amount) {
    amount = calculateSaleReturn(supply, reserve, reserveRatio, deposit);
  }
}
