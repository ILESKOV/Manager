# Solidity API

## Manager

_After the accumulation of the required number of users, deposits become
unavailable and after the token locking period ends, users can create their own ERC721
standard tokens with the image URI passed by them to createNFT(), metadata stored inside
this contract and owner could withdraw tokens_

### tokenMetaData

```solidity
struct tokenMetaData {
  uint256 id;
  uint256 rare;
  uint256 date;
  string img;
}
```

### _erc20Fee

```solidity
uint256 _erc20Fee
```

### _lockedPeriod

```solidity
uint256 _lockedPeriod
```

### _managerBalance

```solidity
uint256 _managerBalance
```

### _depositorsActive

```solidity
uint256 _depositorsActive
```

### _depositorsLimit

```solidity
uint256 _depositorsLimit
```

### _erc20

```solidity
contract IERC20 _erc20
```

### _ownershipRecord

```solidity
mapping(address => struct Manager.tokenMetaData) _ownershipRecord
```

### _depositsLockTime

```solidity
mapping(address => uint256) _depositsLockTime
```

### _groups

```solidity
mapping(uint256 => uint256) _groups
```

### NewDepositor

```solidity
event NewDepositor(address user, uint256 when)
```

_Emitted when new user deposit _erc20Fee amount of 'TKN' via deposit()_

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | address of user |
| when | uint256 | block.timestamp of transaction |

### Withdrawal

```solidity
event Withdrawal(uint256 amount, uint256 when)
```

_Emitted when owner withdraw unlocked tokens_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | 'TKN' withdrawal amount |
| when | uint256 | block.timestamp of transaction |

### NFTminted

```solidity
event NFTminted(address owner, uint256 id)
```

_Emitted when new NFT minted_

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | NFTs owner address |
| id | uint256 | token Id |

### TKNfeeUpdated

```solidity
event TKNfeeUpdated(uint256 amount)
```

_Emitted when new erc20 fee setted for deposits_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | fee of 'TKN' tokens |

### LockedTimeUpdated

```solidity
event LockedTimeUpdated(uint256 timeInSec)
```

_Emitted when new locked time setted_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timeInSec | uint256 | new lock time in seconds |

### RarityUpdated

```solidity
event RarityUpdated(uint256 depositorsLimit, uint256 firstGroupElements_, uint256 secondGroupElements_, uint256 thirdGroupElements_, uint256 fourthGroupElements_)
```

_Emitted when new depositors limit and rarities setted_

| Name | Type | Description |
| ---- | ---- | ----------- |
| depositorsLimit | uint256 | new limit of depositors and in consequences NFTs |
| firstGroupElements_ | uint256 | first group which has individual rarity property |
| secondGroupElements_ | uint256 | second group which has individual rarity property |
| thirdGroupElements_ | uint256 | third group which has individual rarity property |
| fourthGroupElements_ | uint256 | four group which has individual rarity property |

### constructor

```solidity
constructor(address token, uint256 erc20Fee_, uint256 lockedPeriod_, uint256 depositorsLimit_, uint256 firstGroupElements_, uint256 secondGroupElements_, uint256 thirdGroupElements_, uint256 fourthGroupElements_) public
```

_initial metadata base uri pasted into ERC721 contract constructor_

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | address of token that required to deposit |
| erc20Fee_ | uint256 | 'TKN' fee for creating custom NFTs |
| lockedPeriod_ | uint256 | locked period for tokens after the user makes a deposit |
| depositorsLimit_ | uint256 | new limit of depositors and in consequences NFTs |
| firstGroupElements_ | uint256 | first group which has individual rarity property |
| secondGroupElements_ | uint256 | second group which has individual rarity property |
| thirdGroupElements_ | uint256 | third group which has individual rarity property |
| fourthGroupElements_ | uint256 | four group which has individual rarity property |

### deposit

```solidity
function deposit() external
```

_This is a function to accept payment in tokens to create a custom NFT
User can only deposit once
Required approval amount of _erc20Fee tokens for this contract to make a deposit
Tokens are locked for 1 minute and NewDepositor event emitted_

### createNFT

```solidity
function createNFT(string imgURI) external
```

_Function to create NFT after erc-20 tokens are deposited and unlocked
User needs to transmit image URI in order to create Metadata of token
NFTminted event emitted_

| Name | Type | Description |
| ---- | ---- | ----------- |
| imgURI | string | The URI of the image that user wants to be an NFT |

### _createMetadata

```solidity
function _createMetadata(uint256 tokenId_, string imgURI) private
```

_Creating metadata inside a contract
Only available inside createNFT(). Metadata
has 4 fields: id, rarity, token creation date, img URI._

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId_ | uint256 | tokenId |
| imgURI | string | URI transmitted by user in createNFT() |

### updateRarityGroups

```solidity
function updateRarityGroups(uint256 depositorsLimit_, uint256 firstGroupElements_, uint256 secondGroupElements_, uint256 thirdGroupElements_, uint256 fourthGroupElements_) external
```

_Function allow owner of the contract update depositors limit and set
rarities property for groups of NFTs_

| Name | Type | Description |
| ---- | ---- | ----------- |
| depositorsLimit_ | uint256 | new limit of depositors and in consequences NFTs |
| firstGroupElements_ | uint256 | first group which has individual rarity property |
| secondGroupElements_ | uint256 | second group which has individual rarity property |
| thirdGroupElements_ | uint256 | third group which has individual rarity property |
| fourthGroupElements_ | uint256 | four group which has individual rarity property |

### withdrawTokens

```solidity
function withdrawTokens(uint256 amount) external
```

_The function of withdrawing erc-20 tokens after unlocking them
Only available for contract owner. Withdrawal event emitted_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount of tokens owner want to withdraw |

### updateTokenFee

```solidity
function updateTokenFee(uint256 erc20Fee_) external
```

_Set new _erc20Fee_

| Name | Type | Description |
| ---- | ---- | ----------- |
| erc20Fee_ | uint256 | new fee of 'TKN' tokens in order to create custom NFT |

### updateLockedPeriod

```solidity
function updateLockedPeriod(uint256 lockedPeriod_) external
```

_Set new _lockedPeriod_

| Name | Type | Description |
| ---- | ---- | ----------- |
| lockedPeriod_ | uint256 | new locked period of deposited tokens |

### getLockedPeriod

```solidity
function getLockedPeriod() external view returns (uint256)
```

_Returns locked period for deposited tokens_

### getTokenFee

```solidity
function getTokenFee() external view returns (uint256)
```

_Returns fee of 'TKN' tokens in order to create custom NFT_

### getDepositorsLimit

```solidity
function getDepositorsLimit() external view returns (uint256)
```

_Returns the current limit of depositors_

### getOwnershipRecord

```solidity
function getOwnershipRecord(address user) external view returns (struct Manager.tokenMetaData)
```

_Returns metadata object of token_

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | the address of the user whose NFT metadata we are looking for |

### getUnlockTime

```solidity
function getUnlockTime(address user) external view returns (uint256 unlockTime)
```

_Returns unlocked time for each deposit_

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | the address of the user whose deposit data we are looking for |

### getContractBalance

```solidity
function getContractBalance() external view returns (uint256)
```

_Returns Manager balance of available ERC-20 'TKN' tokens available for withdraw_

### getAmountOfDepositors

```solidity
function getAmountOfDepositors() external view returns (uint256)
```

_Returns amount of all active depositors_

## NFT

### tokenId

```solidity
uint256 tokenId
```

### _baseURI_

```solidity
string _baseURI_
```

### _uriAlreadyUpdated

```solidity
bool _uriAlreadyUpdated
```

### constructor

```solidity
constructor(string _baseUri) public
```

| Name | Type | Description |
| ---- | ---- | ----------- |
| _baseUri | string | metadata initial URI |

### _baseURI

```solidity
function _baseURI() internal view returns (string)
```

_Getter for _baseURI override getter for empty _baseURI from ERC721.sol_

### updateBaseURI

```solidity
function updateBaseURI(string newBaseUri) external
```

_Update _baseURI_
Can only be called once by the owner when all tokens have been minted_

| Name | Type | Description |
| ---- | ---- | ----------- |
| newBaseUri | string | new metadata json format URI |

### uriWasUpdated

```solidity
function uriWasUpdated() external view returns (bool)
```

_Check if URI was already updated_

### getLatestTokenId

```solidity
function getLatestTokenId() external view returns (uint256)
```

_Getter for id of last minted token_

## TKN

### WithdrawalOfOwner

```solidity
event WithdrawalOfOwner(address owner, uint256 amount)
```

### constructor

```solidity
constructor() public
```

_Each token has 18 decimals
Mint initial 75000 amount of tokens for the owner_

### buyToken

```solidity
function buyToken() public payable
```

_Each user can mint an additional number of tokens at a price
0.0001 ETH per token_

### withdrawETH

```solidity
function withdrawETH(uint256 amount) external
```

_Owner can withdraw Ether from contract_

