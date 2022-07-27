//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Token contract
 * NOTE: Contract inherit from openzeppelin ERC20 and add function for initial minting
 * and withdraw of tokens
 */
contract Token is ERC20, Ownable {
    event WithdrawalOfOwner(address owner, uint256 indexed amount);

    /**
     * NOTE: Each token has 18 decimals
     * @dev Mint initial 75000 amount of tokens for the owner
     */
    constructor() ERC20("Token", "TKN") {
        _mint(msg.sender, 75000 * 10**18);
    }

    /**
     * @dev Each user can mint an additional number of tokens at a price
     * 0.0001 ETH per token
     */
    function buyToken() public payable {
        require(msg.value >= 0.0001 ether, "1 token cost 0.0001 ETH");
        _mint(msg.sender, (msg.value / 0.0001 ether) * 10**18);
    }

    /**
     * @dev Owner can withdraw Ether from contract
     */
    function withdrawETH(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Not enough ETH");
        payable(owner()).transfer(amount);
        emit WithdrawalOfOwner(msg.sender, amount);
    }
}
