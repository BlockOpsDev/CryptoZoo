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

  constructor(
    IERC20 reserveToken,
    string memory name,
    string memory symbol,
    uint256 minReserve,
    uint256 supply,
    uint256 ratio
  ) ContinuousToken(name, symbol, minReserve, supply, ratio) {
    _reserveToken = reserveToken;
  }

  function reserveBalance() public view virtual override returns (uint256) {
    return _reserveToken.balanceOf(address(this));
  }

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
}
