pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";


contract aAnimal is ERC721Full, ERC721Burnable {
    constructor () public ERC721Full('aAnimal', 'AAN') { }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        return _tokensOfOwner(owner);
    }

    function setTokenURI(uint256 tokenId, string memory uri) public {
        _setTokenURI(tokenId, uri);
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}
