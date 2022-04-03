//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SnakeNFT is ERC721, ERC721Pausable, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string internal baseTokenURI;

    uint public totalSupply;
    uint public totalMinted = 0;

    constructor(string memory _baseTokenURI, uint _totalSupply) ERC721("SnakeNFT", "SNAKE") {
        baseTokenURI = _baseTokenURI;
        totalSupply = _totalSupply;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseTokenURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function mint(address to) public returns (uint256)
    {
        require(totalMinted < totalSupply, "Total supply exceeded, no more available tokens");
        
        _tokenIdCounter.increment();
        _mint(to, _tokenIdCounter.current());
        totalMinted++;

        return _tokenIdCounter.current();
    }
}
