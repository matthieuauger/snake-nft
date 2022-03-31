import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Snake contract should allow users to mint ERC721 and owner to administrate", function () {
  let snakeNFTContract: Contract;
  let owner: SignerWithAddress;
  let normalUser: SignerWithAddress;

  /**
   * All the tests begin by the creation and deployment of the contract
   * 2 users are accessible for the tests:
   *     - The owner, who deployed the contract and should have access to administration features
   *     - A normal user, who will mint NFT and access public functions that don't require administration
   * 
   * For the tests, we create a contract with two parameters:
   *     - The baseURL that will be used for all NFT metadata
   *     - The total supply that should not be exceeded when minting some NFTs
   */
  beforeEach(async () => {
    const SnakeNFTFactory = await ethers.getContractFactory("SnakeNFT");
    [owner, normalUser] = await ethers.getSigners();
    snakeNFTContract = await SnakeNFTFactory.deploy(
      "YOUR_API_URL/api/erc721/",
      3
    );
  });

  it("Deployment should name contract SnakeNFT", async function () {
    expect(await snakeNFTContract.name()).to.equal("SnakeNFT");
  });
  
  it("Minting should assign 1 nft to minter", async function () {
    expect(await snakeNFTContract.balanceOf(owner.address)).to.equal(0);

    await snakeNFTContract.mint(owner.address);

    expect(await snakeNFTContract.balanceOf(owner.address)).to.equal(1);
    expect(await snakeNFTContract.ownerOf(1)).to.equal(owner.address);
    expect(await snakeNFTContract.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");
  });  
  
  it("Owner can change baseURI", async function () {    
    await snakeNFTContract.mint(owner.address);
    expect(await snakeNFTContract.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");

    await snakeNFTContract.setBaseTokenURI("YOUR_API_URL_2/api/erc721/");
    expect(await snakeNFTContract.tokenURI(1)).to.equal("YOUR_API_URL_2/api/erc721/1");
  });
  
  it("Only Owner can change baseURI", async function () {
    snakeNFTContract = snakeNFTContract.connect(normalUser);

    await snakeNFTContract.mint(normalUser.address);
    expect(await snakeNFTContract.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");

    await expect(snakeNFTContract.setBaseTokenURI("YOUR_API_URL_2/api/erc721/"))
        .to.be.revertedWith('Ownable: caller is not the owner');
  });

  it("Can't mint more than supply", async function () {
    await snakeNFTContract.mint(owner.address);
    await snakeNFTContract.mint(owner.address);
    await snakeNFTContract.mint(owner.address);
    
    await expect(snakeNFTContract.mint(owner.address))
        .to.be.revertedWith("Total supply exceeded, no more available tokens");
  });

  it("Owner can pause contract", async function () {
    await snakeNFTContract.mint(owner.address);
    await snakeNFTContract.pause();
    
    await expect(snakeNFTContract.mint(owner.address))
        .to.be.revertedWith("Pausable: paused");      
  });  
  
  it("Owner can unpause contract", async function () {
    const [owner] = await ethers.getSigners();
    await snakeNFTContract.pause();
    await snakeNFTContract.unpause();  
    await expect(snakeNFTContract.mint(owner.address))
        .to.not.be.reverted;
  });

  it("Only Owner can pause and unpause contract", async function () {
    snakeNFTContract = snakeNFTContract.connect(normalUser);

    await expect(snakeNFTContract.pause())
        .to.be.revertedWith('Ownable: caller is not the owner');
    
    await expect(snakeNFTContract.unpause())
        .to.be.revertedWith('Ownable: caller is not the owner');
  });
});