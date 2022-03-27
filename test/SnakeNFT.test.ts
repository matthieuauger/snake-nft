import { expect } from "chai";
import { ethers } from "hardhat";

describe("Snake contract", function () {
  type contractConfiguration = {
    totalSupply: number;
  }

  async function deployAndGetToken(config: contractConfiguration) {
    const Token = await ethers.getContractFactory("SnakeNFT");
    return await Token.deploy("YOUR_API_URL/api/erc721/", config.totalSupply);
  }

  it("Deployment should name contract SnakeNFT", async function () {
    const snakeToken = await deployAndGetToken({totalSupply: 10});
    expect(await snakeToken.name()).to.equal("SnakeNFT");
  });
  
  it("Minting should assign 1 nft to minter", async function () {
    const [owner] = await ethers.getSigners();

    const snakeToken = await deployAndGetToken({totalSupply: 10});
    expect(await snakeToken.balanceOf(owner.address)).to.equal(0);

    await snakeToken.mint(owner.address);

    expect(await snakeToken.balanceOf(owner.address)).to.equal(1);
    expect(await snakeToken.ownerOf(1)).to.equal(owner.address);
    expect(await snakeToken.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");
  });  
  
  it("Owner can change baseURI", async function () {
    const [owner] = await ethers.getSigners();

    const snakeToken = await deployAndGetToken({totalSupply: 10});
    await snakeToken.mint(owner.address);
    expect(await snakeToken.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");

    await snakeToken.setBaseTokenURI("YOUR_API_URL_2/api/erc721/");
    expect(await snakeToken.tokenURI(1)).to.equal("YOUR_API_URL_2/api/erc721/1");
  });
  
  it("Only Owner can change baseURI", async function () {
    const [, maliciousUser] = await ethers.getSigners();

    const snakeToken = await deployAndGetToken({totalSupply: 10});
    const maliciousUserToken = await snakeToken.connect(maliciousUser);

    await maliciousUserToken.mint(maliciousUser.address);
    expect(await maliciousUserToken.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");

    await expect(maliciousUserToken.setBaseTokenURI("YOUR_API_URL_2/api/erc721/"))
        .to.be.revertedWith('Ownable: caller is not the owner');
  });

  it("Can't mint more than supply", async function () {
    const [owner] = await ethers.getSigners();

    const snakeToken = await deployAndGetToken({totalSupply: 3});
    await snakeToken.mint(owner.address);
    await snakeToken.mint(owner.address);
    await snakeToken.mint(owner.address);
    
    await expect(snakeToken.mint(owner.address))
        .to.be.revertedWith("Total supply exceeded, no more available tokens");
  });
});