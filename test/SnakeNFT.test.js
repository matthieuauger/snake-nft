const { expect } = require("chai");

describe("Snake contract", function () {
  async function getToken() {
    const Token = await ethers.getContractFactory("SnakeNFT");
    return await Token.deploy("YOUR_API_URL/api/erc721/");
  }

  it("Deployment should name contract SnakeNFT", async function () {
    const snakeToken = await getToken();
    expect(await snakeToken.name()).to.equal("SnakeNFT");
  });
  
  it("Minting should assign 1 nft to minter", async function () {
    const [owner] = await ethers.getSigners();

    const snakeToken = await getToken();
    expect(await snakeToken.balanceOf(owner.address)).to.equal(0);

    await snakeToken.mint(owner.address);

    expect(await snakeToken.balanceOf(owner.address)).to.equal(1);
    expect(await snakeToken.ownerOf(1)).to.equal(owner.address);
    expect(await snakeToken.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");
  });  
  
  it("Owner can change baseURI", async function () {
    const [owner] = await ethers.getSigners();

    const snakeToken = await getToken();
    await snakeToken.mint(owner.address);
    expect(await snakeToken.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");

    await snakeToken.setBaseTokenURI("YOUR_API_URL_2/api/erc721/");
    expect(await snakeToken.tokenURI(1)).to.equal("YOUR_API_URL_2/api/erc721/1");
  });
  
  it("Only Owner can change baseURI", async function () {
    const [, maliciousUser] = await ethers.getSigners();

    const snakeToken = await getToken();
    const maliciousUserToken = await snakeToken.connect(maliciousUser);

    await maliciousUserToken.mint(maliciousUser.address);
    expect(await maliciousUserToken.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");

    await expect(maliciousUserToken.setBaseTokenURI("YOUR_API_URL_2/api/erc721/"))
        .to.be.revertedWith('Ownable: caller is not the owner');
  });
});