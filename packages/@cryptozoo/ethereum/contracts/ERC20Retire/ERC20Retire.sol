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

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @title ERC20 Retire
 * @notice Retire tokens to remove them from the circulating supply
 *
 * @dev Once a token has been retired it should never return to circulation
 * When using this extention make sure tokens can never be removed from address(this)
 *
 * This extension on the ERC20 adds a function that returns the token's circulating supply
 * and a function to reduce the circulating supply by retiring tokens
 */
abstract contract ERC20Retire is Context, ERC20 {
  event Retire(address indexed account, uint256 amount);

  /**
   * @notice ERC20 Token Circulating Supply
   * @return circulatingSupply the tradable supply
   */
  function circulatingSupply() public view virtual returns (uint256) {
    return totalSupply() - balanceOf(address(this));
  }

  /**
   * @notice Retire tokens from circulation
   *
   * @param amount  number of tokens to retire
   *
   * @dev Retired Tokens are stored at the token address
   */
  function retire(uint256 amount) public virtual {
    _transfer(_msgSender(), address(this), amount);
  }

  /**
   * @dev emit Retire event when tokens are retired (sent to address(this))
   */
  function _transfer(
    address from,
    address to,
    uint256 amount
  ) internal virtual override {
    super._transfer(from, to, amount);

    if (to == address(this)) {
      emit Retire(_msgSender(), amount);
    }
  }
}
