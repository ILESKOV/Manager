// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ERC721.sol";

/**
 * @title Manager contract
 * NOTE: Contract lock user tokens and create for them NFT with transmitted
 * custom img
 * @dev After the accumulation of the required number of users, deposits become
 * unavailable and after the token locking period ends, users can create their own ERC721
 * standard tokens with the image URI passed by them to createNFT(), metadata stored inside
 * this contract and owner could withdraw tokens
 */
contract Manager is NFT {
    uint256 private _erc20Fee = 5000 * 10**18;
    uint256 private _lockedPeriod = 60;
    uint256 private _managerBalance;
    uint256 private _depositors;

    struct tokenMetaData {
        uint256 id;
        string rare;
        uint256 date;
        string img;
    }

    mapping(address => tokenMetaData) private _ownershipRecord;
    mapping(address => uint256) private _depositsLockTime;

    event NewDepositor(address user, uint256 when);
    event Withdrawal(uint256 indexed amount, uint256 when);
    event NFTminted(address indexed owner, uint256 id);

    IERC20 public erc20;

    /**
     * @dev initial metadata base uri pasted into ERC721 contract constructor
     * @param token address of token that required to deposit
     */
    constructor(address token) NFT("ipfs://bafybeig5yw7u5xy3oynsyxaazkbtu66jxblwexh4aghb3r7dyozdh5upxi/") {
        erc20 = IERC20(token);
    }

    /**
     * NOTE: This is a function to accept payment in tokens to create a custom NFT
     * User can only deposit once
     * @dev Required _erc20Fee amount of tokens approval for this contract in order to deposit
     * Tokens are locked for 1 minute and NewDepositor event emitted
     */
    function deposit() public {
        require(erc20.allowance(msg.sender, address(this)) >= _erc20Fee, "Not enough tokens approved");
        require(!(_depositsLockTime[msg.sender] > 0), "You already deposited");
        require(_depositors < 10, "All deposits have been made");
        _depositors++;
        bool success = erc20.transferFrom(msg.sender, address(this), _erc20Fee);
        if (success) {
            _depositsLockTime[msg.sender] = block.timestamp + _lockedPeriod;
            emit NewDepositor(msg.sender, block.timestamp);
        }
    }

    /**
     * NOTE: Function to create NFT after erc-20 tokens are deposited and unlocked
     * @dev User needs to transmit image URI in order to create Metadata of token
     * @param imgURI The URI of the image that user wants to be an NFT
     * NFTminted event emitted
     */
    function createNFT(string memory imgURI) public {
        require(!(_ownershipRecord[msg.sender].id > 0), "You have already minted your NFT");
        require(_depositsLockTime[msg.sender] > 0, "Deposit required");
        require(block.timestamp >= _depositsLockTime[msg.sender], "Not available yet. Wait...");
        tokenId++;
        _managerBalance += _erc20Fee;
        _createMetadata(tokenId, imgURI);
        _safeMint(msg.sender, tokenId);
        emit NFTminted(msg.sender, tokenId);
    }

    /**
     * NOTE: Creating metadata inside a contract
     * @dev Only available inside the NFT creation function. Metadata
     * has 4 fields: id, rarity, token creation date, img URI.
     * @param tokenId_ tokenId
     * @param imgURI URI transmitted by user in createNFT() function
     */
    function _createMetadata(uint256 tokenId_, string memory imgURI) private {
        _ownershipRecord[msg.sender].id = tokenId_;
        if (tokenId_ > 0 && tokenId_ <= 4) {
            _ownershipRecord[msg.sender].rare = "40%";
        } else if (tokenId_ <= 7) {
            _ownershipRecord[msg.sender].rare = "30%";
        } else if (tokenId_ <= 9) {
            _ownershipRecord[msg.sender].rare = "20%";
        } else _ownershipRecord[msg.sender].rare = "10%";
        _ownershipRecord[msg.sender].date = block.timestamp;
        _ownershipRecord[msg.sender].img = imgURI;
    }

    /**
     * NOTE: The function of withdrawing erc-20 tokens after unlocking them
     * @dev Only available for contract owner
     * @param amount Amount of tokens owner want to withdraw
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(erc20.balanceOf(address(this)) >= amount, "Not enough tokens available");
        _managerBalance -= amount;
        bool success = erc20.transfer(owner(), amount);
        if (success) {
            emit Withdrawal(amount, block.timestamp);
        }
    }

    /**
     * NOTE: Getter for metadata of users token
     * @dev Return metadata object of token
     */
    function getOwnershipRecord(address user) external view returns (tokenMetaData memory) {
        require((_depositsLockTime[user] > 0), "This user have no any ownerships");
        return _ownershipRecord[user];
    }

    /**
     * @dev Getter for unlocked Time for each deposit
     */
    function getUnlockTime(address user) external view returns (uint256 unlockTime) {
        return _depositsLockTime[user];
    }

    /**
     * @dev Getter for Manager Balance of available ERC-20 tokens for withdraw
     */
    function getContractBalance() external view returns (uint256) {
        return _managerBalance;
    }

    /**
     * @dev Getter for required fee of erc-20 tokens in order to deposit
     */
    function getTokenFee() external view returns (uint256) {
        return _erc20Fee;
    }

    /**
     * @dev Getter for amount of all depositors
     */
    function getAmountOfDepositors() external view returns (uint256) {
        return _depositors;
    }
}
