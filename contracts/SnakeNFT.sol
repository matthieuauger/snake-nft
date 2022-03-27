//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SnakeNFT is ERC721, Ownable {
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

    function mint(address to)
        public returns (uint256)
    {
        require(totalMinted < totalSupply, "Total supply exceeded, no more available tokens");
        
        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());
        totalMinted++;

        return _tokenIdCounter.current();
    }
}
