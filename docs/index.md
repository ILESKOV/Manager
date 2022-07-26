# Solidity API

## NFT

### tokenId

```solidity
uint256 tokenId
```

### BASE_URI

```solidity
string BASE_URI
```

### uriAlreadyUpdated

```solidity
bool uriAlreadyUpdated
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

NOTE: Update BASE_URI

_Can only be called once by the owner when all tokens have been minted_

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

## Manager

_After the accumulation of the required number of users, deposits become
unavailable and after the token locking period ends, users can create their own ERC721
standard tokens with the image URI passed by them to createNFT(), metadata stored inside
this contract and owner could withdraw tokens_

### lockedPeriod

```solidity
uint256 lockedPeriod
```

### managerBalance

```solidity
uint256 managerBalance
```

### depositors

```solidity
uint256 depositors
```

### tokenMetaData

```solidity
struct tokenMetaData {
  uint256 id;
  string rare;
  uint256 date;
  string img;
}
```

### ownershipRecord

```solidity
mapping(address => struct Manager.tokenMetaData) ownershipRecord
```

### DepositsLockTime

```solidity
mapping(address => uint256) DepositsLockTime
```

### alreadyDeposited

```solidity
mapping(address => bool) alreadyDeposited
```

### newDepositor

```solidity
event newDepositor(address user, uint256 when)
```

### Withdrawal

```solidity
event Withdrawal(uint256 amount, uint256 when)
```

### NFTminted

```solidity
event NFTminted(address owner, uint256 Id)
```

### erc20

```solidity
contract IERC20 erc20
```

### constructor

```solidity
constructor(address token) public
```

_initial metadata base uri pasted into ERC721 contract constructor_

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | address of token that required to deposit |

### deposit

```solidity
function deposit() public
```

NOTE: This is a function to accept payment in tokens to create a custom NFT
User can only deposit once

_Required 5000 tokens approval for this contract in order to deposit
Tokens are locked for 1 minute and newDepositor event emitted_

### createNFT

```solidity
function createNFT(string imgURI) public
```

NOTE: Function to create NFT after erc-20 tokens are deposited and unlocked

_User needs to transmit image URI in order to create Metadata of token_

| Name | Type | Description |
| ---- | ---- | ----------- |
| imgURI | string | The URI of the image that user wants to be an NFT NFTminted event emitted |

### createMetadata

```solidity
function createMetadata(uint256 tokenId_, string imgURI) private
```

NOTE: Creating metadata inside a contract

_Only available inside the NFT creation function. Metadata
has 4 fields: id, rarity, token creation date, img URI._

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId_ | uint256 | tokenId |
| imgURI | string | URI transmitted by user in createNFT() function |

### withdrawTokens

```solidity
function withdrawTokens(uint256 amount) external
```

NOTE: The function of withdrawing erc-20 tokens after unlocking them

_Only available for contract owner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount of tokens owner want to withdraw |

### getOwnershipRecord

```solidity
function getOwnershipRecord(address user) external view returns (struct Manager.tokenMetaData)
```

NOTE: Getter for metadata of users token

_Return metadata object of token_

### getUnlockTime

```solidity
function getUnlockTime(address user) external view returns (uint256 unlockTime)
```

_Getter for unlocked Time for each deposit_

### getContractBalance

```solidity
function getContractBalance() external view returns (uint256)
```

_Getter for Manager Balance of available ERC-20 tokens for withdraw_

### isDeposited

```solidity
function isDeposited(address user) public view returns (bool)
```

_Check if user already make a deposit_

## Token

### constructor

```solidity
constructor() public
```

_Mint initial 75000 amount of tokens for the owner_

### buyToken

```solidity
function buyToken() public payable
```

_Each user can mint an additional number of tokens at a price
0.0001 ETH per token_

