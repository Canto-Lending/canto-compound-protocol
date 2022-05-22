// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract TestERC20 is ERC20, ERC20Detailed {
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply) ERC20Detailed(name_, symbol_, decimals_) public {
        _mint(msg.sender, initialSupply);
    }
}