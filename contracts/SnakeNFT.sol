//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SnakeNFT is 
    Context,
    AccessControlEnumerable,
    ERC721Enumerable,
    ERC721Burnable,
    ERC721Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string internal _baseTokenURI;

    uint public _totalSupply;
    uint public _totalMinted = 0;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor(string memory baseTokenURI, uint totalSupply) ERC721("SnakeNFT", "SNAKE") {
        _baseTokenURI = baseTokenURI;
        _totalSupply = totalSupply;

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _setupRole(PAUSER_ROLE, _msgSender());
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseTokenURI(string memory baseTokenURI) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "setBaseTokenURI: must have admin role to set base token URI");

        _baseTokenURI = baseTokenURI;
    }

    function pause() external {
        require(hasRole(PAUSER_ROLE, _msgSender()), "Pause: must have pauser role to pause");
        _pause();
    }
    
    function unpause() external {
        require(hasRole(PAUSER_ROLE, _msgSender()), "Unpause: must have pauser role to unpause");
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function mint(address to) public returns (uint256)
    {
        require(_totalMinted < _totalSupply, "Total supply exceeded, no more available tokens");
        
        _tokenIdCounter.increment();
        _mint(to, _tokenIdCounter.current());
        _totalMinted++;

        return _tokenIdCounter.current();
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable, ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
