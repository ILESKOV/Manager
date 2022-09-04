// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NFT.sol";

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
    struct tokenMetaData {
        uint256 id;
        uint256 rare;
        uint256 date;
        string img;
    }

    uint256 private _erc20Fee;
    uint256 private _lockedPeriod;
    uint256 private _managerBalance;
    uint256 private _depositorsActive;
    uint256 private _depositorsLimit;
    IERC20 private _erc20;

    // Mapping from owner address to tokenMetadata.
    mapping(address => tokenMetaData) private _ownershipRecord;
    // Mapping from depositor address to tokens unlock time.
    mapping(address => uint256) private _depositsLockTime;
    // Mapping from group number to amount of tokens.   
    mapping(uint256 => uint256) private _groups;

    /**
     * @dev Emitted when new user deposit _erc20Fee amount of 'TKN' via deposit()
     * @param user address of user
     * @param when block.timestamp of transaction
     */
    event NewDepositor(address user, uint256 when);

    /**
     * @dev Emitted when owner withdraw unlocked tokens
     * @param amount 'TKN' withdrawal amount
     * @param when block.timestamp of transaction
     */
    event Withdrawal(uint256 amount, uint256 when);

    /**
     * @dev Emitted when new NFT minted
     * @param owner NFTs owner address
     * @param id token Id
     */
    event NFTminted(address owner, uint256 id);

    /**
     * @dev Emitted when new erc20 fee setted for deposits
     * @param amount fee of 'TKN' tokens
     */
    event TKNfeeUpdated(uint256 amount);

    /**
     * @dev Emitted when new locked time setted
     * @param timeInSec new lock time in seconds
     */
    event LockedTimeUpdated(uint256 timeInSec);

    /**
     * @dev Emitted when new depositors limit and rarities setted
     * @param depositorsLimit new limit of depositors and in consequences NFTs
     * @param firstGroupElements_ first group which has individual rarity property
     * @param secondGroupElements_ second group which has individual rarity property
     * @param thirdGroupElements_ third group which has individual rarity property
     * @param fourthGroupElements_ four group which has individual rarity property
     */
    event RarityUpdated(
        uint256 depositorsLimit,
        uint256 firstGroupElements_,
        uint256 secondGroupElements_,
        uint256 thirdGroupElements_,
        uint256 fourthGroupElements_
    );

    /**
     * @dev initial metadata base uri pasted into ERC721 contract constructor
     * @param token address of token that required to deposit
     * @param erc20Fee_ 'TKN' fee for creating custom NFTs
     * @param lockedPeriod_ locked period for tokens after the user makes a deposit
     * @param depositorsLimit_ new limit of depositors and in consequences NFTs
     * @param firstGroupElements_ first group which has individual rarity property
     * @param secondGroupElements_ second group which has individual rarity property
     * @param thirdGroupElements_ third group which has individual rarity property
     * @param fourthGroupElements_ four group which has individual rarity property
     */
    constructor(
        address token,
        uint256 erc20Fee_,
        uint256 lockedPeriod_,
        uint256 depositorsLimit_,
        uint256 firstGroupElements_,
        uint256 secondGroupElements_,
        uint256 thirdGroupElements_,
        uint256 fourthGroupElements_
    ) NFT("ipfs://bafybeig5yw7u5xy3oynsyxaazkbtu66jxblwexh4aghb3r7dyozdh5upxi/") {
        require(token != address(0), "Incorrect address of token");
        require(erc20Fee_ != 0, "Fee must be higher than 0");
        require(
            (firstGroupElements_ + secondGroupElements_ + thirdGroupElements_ + fourthGroupElements_) ==
                depositorsLimit_,
            "Sum of elements should equal depositorsLimit"
        );
        _erc20 = IERC20(token);
        _erc20Fee = erc20Fee_ * 10**18;
        _lockedPeriod = lockedPeriod_;
        _depositorsLimit = depositorsLimit_;
        _groups[1] = firstGroupElements_;
        _groups[2] = secondGroupElements_;
        _groups[3] = thirdGroupElements_;
        _groups[4] = fourthGroupElements_;
    }

    /**
     * @dev This is a function to accept payment in tokens to create a custom NFT
     * User can only deposit once
     * Required approval amount of _erc20Fee tokens for this contract to make a deposit
     * Tokens are locked for 1 minute and NewDepositor event emitted
     */
    function deposit() external {
        address caller = msg.sender;
        require(_depositsLockTime[caller] == 0, "You already deposited");
        require(_depositorsActive < _depositorsLimit, "All deposits have been made");
        bool success = _erc20.transferFrom(caller, address(this), _erc20Fee);
        require(success, "Deposit failed");
        _depositorsActive++;
        _depositsLockTime[caller] = block.timestamp + _lockedPeriod;
        emit NewDepositor(caller, block.timestamp);
    }

    /**
     * @dev Function to create NFT after erc-20 tokens are deposited and unlocked
     * User needs to transmit image URI in order to create Metadata of token
     * NFTminted event emitted
     * @param imgURI The URI of the image that user wants to be an NFT
     */
    function createNFT(string memory imgURI) external {
        address caller = msg.sender;
        require(_ownershipRecord[caller].id == 0, "You have already minted your NFT");
        require(_depositsLockTime[caller] != 0, "Deposit required");
        require(block.timestamp >= _depositsLockTime[caller], "Not available yet. Wait...");
        require(_groups[1] != 0, "First set up RarityGroups");
        tokenId++;
        _managerBalance += _erc20Fee;
        _createMetadata(tokenId, imgURI);
        _safeMint(caller, tokenId);
        emit NFTminted(caller, tokenId);
    }

    /**
     * @dev Creating metadata inside a contract
     * Only available inside createNFT(). Metadata
     * has 4 fields: id, rarity, token creation date, img URI.
     * @param tokenId_ tokenId
     * @param imgURI URI transmitted by user in createNFT()
     */
    function _createMetadata(uint256 tokenId_, string memory imgURI) private {
        address caller = msg.sender;
        _ownershipRecord[caller].id = tokenId_;
        if (tokenId_ > 0 && tokenId_ <= _groups[1]) {
            _ownershipRecord[caller].rare = (10**5 * _groups[1]) / _depositorsLimit;
        } else if (tokenId_ <= _groups[1] + _groups[2]) {
            _ownershipRecord[caller].rare = (10**5 * _groups[2]) / _depositorsLimit;
        } else if (tokenId_ <= _groups[1] + _groups[2] + _groups[3]) {
            _ownershipRecord[caller].rare = (10**5 * _groups[3]) / _depositorsLimit;
        } else _ownershipRecord[caller].rare = (10**5 * _groups[4]) / _depositorsLimit;
        _ownershipRecord[caller].date = block.timestamp;
        _ownershipRecord[caller].img = imgURI;
    }

    /**
     * @dev Function allow owner of the contract update depositors limit and set
     * rarities property for groups of NFTs
     * @param depositorsLimit_ new limit of depositors and in consequences NFTs
     * @param firstGroupElements_ first group which has individual rarity property
     * @param secondGroupElements_ second group which has individual rarity property
     * @param thirdGroupElements_ third group which has individual rarity property
     * @param fourthGroupElements_ four group which has individual rarity property
     */
    function updateRarityGroups(
        uint256 depositorsLimit_,
        uint256 firstGroupElements_,
        uint256 secondGroupElements_,
        uint256 thirdGroupElements_,
        uint256 fourthGroupElements_
    ) external onlyOwner {
        require(
            (firstGroupElements_ + secondGroupElements_ + thirdGroupElements_ + fourthGroupElements_) ==
                depositorsLimit_,
            "Sum of elements should equal depositorsLimit"
        );
        _groups[1] = firstGroupElements_;
        _groups[2] = secondGroupElements_;
        _groups[3] = thirdGroupElements_;
        _groups[4] = fourthGroupElements_;
        _depositorsLimit = depositorsLimit_;
        emit RarityUpdated(_depositorsLimit, _groups[1], _groups[2], _groups[3], _groups[4]);
    }

    /**
     * @dev The function of withdrawing erc-20 tokens after unlocking them
     * Only available for contract owner. Withdrawal event emitted
     * @param amount Amount of tokens owner want to withdraw
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(_erc20.balanceOf(address(this)) >= amount, "Not enough tokens available");
        bool success = _erc20.transfer(owner(), amount);
        require(success, "Withdraw failed");
        _managerBalance -= amount;
        emit Withdrawal(amount, block.timestamp);
    }

    /**
     * @dev Set new _erc20Fee
     * @param erc20Fee_ new fee of 'TKN' tokens in order to create custom NFT
     */
    function updateTokenFee(uint256 erc20Fee_) external onlyOwner {
        require(erc20Fee_ != 0, "Fee must be higher than 0");
        _erc20Fee = erc20Fee_ * 10**18;
        emit TKNfeeUpdated(_erc20Fee);
    }

    /**
     * @dev Set new _lockedPeriod
     * @param lockedPeriod_ new locked period of deposited tokens
     */
    function updateLockedPeriod(uint256 lockedPeriod_) external onlyOwner {
        _lockedPeriod = lockedPeriod_;
        emit LockedTimeUpdated(_lockedPeriod);
    }

    /**
     * @dev Returns locked period for deposited tokens
     */
    function getLockedPeriod() external view returns (uint256) {
        return _lockedPeriod;
    }

    /**
     * @dev Returns fee of 'TKN' tokens in order to create custom NFT
     */
    function getTokenFee() external view returns (uint256) {
        return _erc20Fee;
    }

    /**
     * @dev Returns the current limit of depositors
     */
    function getDepositorsLimit() external view returns (uint256) {
        return _depositorsLimit;
    }

    /**
     * @dev Returns metadata object of token
     * @param user the address of the user whose NFT metadata we are looking for
     */
    function getOwnershipRecord(address user) external view returns (tokenMetaData memory) {
        require((_depositsLockTime[user] > 0), "This user have no any ownerships");
        return _ownershipRecord[user];
    }

    /**
     * @dev Returns unlocked time for each deposit
     * @param user the address of the user whose deposit data we are looking for
     */
    function getUnlockTime(address user) external view returns (uint256 unlockTime) {
        return _depositsLockTime[user];
    }

    /**
     * @dev Returns Manager balance of available ERC-20 'TKN' tokens available for withdraw
     */
    function getContractBalance() external view returns (uint256) {
        return _managerBalance;
    }

    /**
     * @dev Returns amount of all active depositors
     */
    function getAmountOfDepositors() external view returns (uint256) {
        return _depositorsActive;
    }
}
