const { expect } = require("chai");

describe("Snake contract", function () {
  async function getToken() {
    const Token = await ethers.getContractFactory("SnakeNFT");
    return await Token.deploy("YOUR_API_URL/api/erc721/");
  }

  it("Deployment should name contract SnakeNFT", async function () {
    const hardhatToken = await getToken();
    expect(await hardhatToken.name()).to.equal("SnakeNFT");
  });
  
  it("Minting should assign 1 nft to minter", async function () {
    const [owner] = await ethers.getSigners();

    const hardhatToken = await getToken();
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(0);

    await hardhatToken.mint(owner.address);

    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1);
    expect(await hardhatToken.ownerOf(1)).to.equal(owner.address);
    expect(await hardhatToken.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");
  });  
  
  it("Owner can change baseURI", async function () {
    const [owner] = await ethers.getSigners();

    const hardhatToken = await getToken();
    await hardhatToken.mint(owner.address);
    expect(await hardhatToken.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");

    await hardhatToken.setBaseTokenURI("YOUR_API_URL_2/api/erc721/");
    expect(await hardhatToken.tokenURI(1)).to.equal("YOUR_API_URL_2/api/erc721/1");
  });
  
  it("Only Owner can change baseURI", async function () {
    const [, maliciousUser] = await ethers.getSigners();

    const hardhatToken = await getToken();
    const maliciousUserToken = await hardhatToken.connect(maliciousUser);

    await maliciousUserToken.mint(maliciousUser.address);
    expect(await maliciousUserToken.tokenURI(1)).to.equal("YOUR_API_URL/api/erc721/1");

    await expect(maliciousUserToken.setBaseTokenURI("YOUR_API_URL_2/api/erc721/"))
        .to.be.revertedWith('Ownable: caller is not the owner');
  });
});