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

// solhint-disable

function _sortTokens(IERC20 tokenA, IERC20 tokenB) pure returns (IERC20[] memory tokens) {
  (uint256 indexTokenA, uint256 indexTokenB) = _getSortedTokenIndexes(tokenA, tokenB);
  tokens = new IERC20[](2);
  tokens[indexTokenA] = tokenA;
  tokens[indexTokenB] = tokenB;
}

function _getSortedTokenIndexes(IERC20 tokenA, IERC20 tokenB) pure returns (uint256 indexTokenA, uint256 indexTokenB) {
  if (tokenA < tokenB) {
    return (0, 1);
  } else {
    return (1, 0);
  }
}
