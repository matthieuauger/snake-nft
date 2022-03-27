const { expect } = require("chai");

describe("Snake contract", function () {
  it("Deployment should name contract SnakeNFT", async function () {
    const Token = await ethers.getContractFactory("SnakeNFT");
    const hardhatToken = await Token.deploy();

    expect(await hardhatToken.name()).to.equal("SnakeNFT");
  });
  
  it("Minting should assign 1 nft to minter", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("SnakeNFT");
    const hardhatToken = await Token.deploy();

    expect(await hardhatToken.balanceOf(owner.address)).to.equal(0);

    await hardhatToken.mint(owner.address);

    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1);
    expect(await hardhatToken.ownerOf(1)).to.equal(owner.address);
    expect(await hardhatToken.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");
  });  
  
  it("Owner can change baseURI", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("SnakeNFT");
    const hardhatToken = await Token.deploy();

    await hardhatToken.mint(owner.address);
    expect(await hardhatToken.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");

    await hardhatToken.setBaseTokenURI("YOUR_API_URL_2/api/erc721/");
    expect(await hardhatToken.tokenURI(1)).to.equal("YOUR_API_URL_2/api/erc721/1");
  });
});