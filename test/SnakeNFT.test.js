const { expect } = require("chai");

describe("Snake contract", function () {
  it("Deployment should name contract SnakeNFT", async function () {
    const Token = await ethers.getContractFactory("SnakeNFT");
    const hardhatToken = await Token.deploy();

    expect(await hardhatToken.name()).to.equal("SnakeNFT");
  });

  it("Deployment should assign 0 supply to owner", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("SnakeNFT");
    const hardhatToken = await Token.deploy();

    expect(await hardhatToken.balanceOf(owner.address)).to.equal(0);
  });
});