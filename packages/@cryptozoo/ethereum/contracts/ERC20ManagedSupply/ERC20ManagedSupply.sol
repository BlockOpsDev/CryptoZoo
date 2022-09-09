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
import "../solidity-utils/Ownable2Step.sol";

import "./interfaces/ISupplyManager.sol";

abstract contract ERC20ManagedSupply is Context, ERC20, Ownable2Step {
  address private _supplyManager;

  event SupplyManagerUpdated(address indexed previousManager, address indexed newManager);

  modifier onlySupplyManager() {
    _checkSupplyManager();
    _;
  }

  function totalSupply() public view virtual override returns (uint256) {
    require(supplyManager() != address(0), "Supply Manager Uninitialized");
    return ISupplyManager(supplyManager()).managedSupply();
  }

  function mint(address account, uint256 amount) public virtual onlySupplyManager {
    _mint(account, amount);
  }

  function burn(address account, uint256 amount) public virtual onlySupplyManager {
    _burn(account, amount);
  }

  function supplyManager() public view virtual returns (address) {
    return _supplyManager;
  }

  function _checkSupplyManager() internal view virtual {
    require(supplyManager() == _msgSender(), "Caller is not the supply manager");
  }

  function updateSupplyManager(address newManager) public virtual onlyOwner {
    require(newManager != address(0), "Supply Manager cannot be zero address");
    _updateSupplyManager(newManager);
  }

  function _updateSupplyManager(address newManager) internal virtual {
    address previousManager = _supplyManager;
    _supplyManager = newManager;
    emit SupplyManagerUpdated(previousManager, newManager);
  }
}
