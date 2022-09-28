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
 * @title ERC20 Token Issuer
 * @notice Issuers are responsable for managing the supply of an ERC20Issuable Token
 *
 * @dev An Issuer of a ERC20Issuable Token must implement this Interface
 * Issuers have the ablity to Mint and Burn ERC20Issuable Tokens and manage the Total Supply
 */
interface IERC20Issuer {
  /// @notice Total Supply of the ERC20Issuable Token
  function totalSupplyIssued() external view returns (uint256);
}
