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

/**
 * @title Pool User Data
 * @notice Decode user data from onPoolJoin() and onPoolExit()
 */
library PoolUserData {
  enum JoinKind {
    INIT_PHANTOM_SUPPLY
  }

  enum ExitKind {
    WITHDRAW_MAX,
    WITHDRAW_EXACT,
    REMOVE
  }

  function joinKind(bytes memory self) internal pure returns (JoinKind) {
    return abi.decode(self, (JoinKind));
  }

  function exitKind(bytes memory self) internal pure returns (ExitKind) {
    return abi.decode(self, (ExitKind));
  }

  // Join

  /**
   * @dev INIT_PHANTOM_SUPPLY parameters
   */
  function initialAmounts(bytes memory self) internal pure returns (uint256 phantomSupply, uint256 startSupply) {
    (, phantomSupply, startSupply) = abi.decode(self, (JoinKind, uint256, uint256));
  }

  // Exit

  /**
   * @dev WITHDRAW_EXACT parameters
   */
  function exactReserveWithdraw(bytes memory self) internal pure returns (uint256 withdrawAmount) {
    (, withdrawAmount) = abi.decode(self, (ExitKind, uint256));
  }
}
