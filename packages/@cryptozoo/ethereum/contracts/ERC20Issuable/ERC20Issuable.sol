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

import "../solidity-utils/helpers/Ownable2Step.sol";

import "./interfaces/IERC20Issuer.sol";

/**
 * @title ERC20 Issuable Token
 * @notice ERC20 token whose supply is managed by an external IERC20Issuer
 *
 * @dev The Issuer contract should implement IERC20Issuer
 * see ./interfaces/IERC20Issuer for more details
 */
abstract contract ERC20Issuable is Context, ERC20, Ownable2Step {
  /**
   * @dev Issuer assigned to this token
   */
  address private _issuer;

  event IssuerUpdated(address indexed previousIssuer, address indexed newIssuer);

  /**
   * @dev Restrict caller to _issuer
   */
  modifier onlyIssuer() {
    _checkIssuer();
    _;
  }

  /**
   * @notice ERC20 Token Total Supply
   * @return supply of token
   */
  function totalSupply() public view virtual override returns (uint256) {
    require(issuer() != address(0), "Issuer Uninitialized");
    return IERC20Issuer(issuer()).totalSupplyIssued();
  }

  /**
   * @notice Issuer can mint token to an address
   *
   * @param account  address of the reciever
   * @param amount   number of tokens to mint
   * *
   * @dev Only callable by _issuer
   */
  function mint(address account, uint256 amount) public virtual onlyIssuer {
    _mint(account, amount);
  }

  /**
   * @notice Issuer can burn token from an address
   *
   * @param account  address to burn from
   * @param amount   number of tokens to burn
   *
   * @dev Only callable by _issuer
   */
  function burn(address account, uint256 amount) public virtual onlyIssuer {
    _burn(account, amount);
  }

  /**
   * @notice ERC20 Token Issuer
   * @return _issuer  address of token Issuer
   */
  function issuer() public view virtual returns (address) {
    return _issuer;
  }

  /**
   * @notice Update Issuer address
   *
   * @param newIssuer  address of the new token Issuer
   *
   * @dev Only callable by owner
   */
  function updateIssuer(address newIssuer) public virtual onlyOwner {
    require(newIssuer != address(0), "Issuer cannot be zero address");
    _updateIssuer(newIssuer);
  }

  /**
   * @dev Update _issuer address and emit event
   */
  function _updateIssuer(address newIssuer) internal virtual {
    address previousIssuer = _issuer;
    _issuer = newIssuer;
    emit IssuerUpdated(previousIssuer, newIssuer);
  }

  /**
   * @dev Check if msg.sender is _issuer
   */
  function _checkIssuer() internal view virtual {
    require(issuer() == _msgSender(), "Caller is not the Issuer");
  }
}
