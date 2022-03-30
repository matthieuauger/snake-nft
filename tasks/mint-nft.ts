import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config";

task("mint", "Mints a token")
  .addParam("contract", "The contract address")
  .setAction(async (taskArgs, { ethers }) => {

    const [owner] = await ethers.getSigners();
    const SnakeNFT = await ethers.getContractFactory('SnakeNFT');
    const snakeNFT = SnakeNFT.attach(taskArgs.contract);
    await snakeNFT.mint(owner.address);
  });

module.exports = {};
