const { expect } = require("chai");

describe("Snake contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("SnakeNFT");
    const hardhatToken = await Token.deploy();

    expect(await hardhatToken.name()).to.equal("SnakeNFT");
  });
});