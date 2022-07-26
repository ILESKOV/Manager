//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFT contract
 * NOTE: Contract inherit from openzeppelin ERC721 implementation and also add some
 * functionality for updating baseURI
 */
contract NFT is Ownable, ERC721("NFT", "NFT") {
    uint256 internal tokenId;
    string private _baseURI_;
    bool private uriAlreadyUpdated;

    /**
     * @param _baseUri metadata initial URI
     */
    constructor(string memory _baseUri) {
        _baseURI_ = _baseUri;
    }

    /**
     * @dev Getter for _baseURI override getter for empty _baseURI from ERC721.sol
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseURI_;
    }

    /**
     * NOTE: Update _baseURI_
     * @dev Can only be called once by the owner when all tokens have been minted
     * @param newBaseUri new metadata json format URI
     */
    function updateBaseURI(string memory newBaseUri) external onlyOwner {
        require(_exists(10), "Wait to all tokens to be minted");
        require(!uriAlreadyUpdated, "Base URI was already updated");
        _baseURI_ = newBaseUri;
        uriAlreadyUpdated = true;
    }

    /**
     * @dev Check if URI was already updated
     */
    function uriWasUpdated() external view returns (bool) {
        return uriAlreadyUpdated;
    }

    /**
     * @dev Getter for id of last minted token
     */
    function getLatestTokenId() external view returns (uint256) {
        return tokenId;
    }
}
