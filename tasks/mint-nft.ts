import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

task("mint", "Mints a token")
  .addOptionalParam("contract", "The contract address")
  .setAction(async (taskArgs, { ethers }) => {

    let contractAddress = taskArgs.contract;
    if (typeof CONTRACT_ADDRESS !== "undefined") {
      contractAddress = CONTRACT_ADDRESS;
    }

    if (contractAddress === undefined) {
      console.error('Error: No contract address has been found either on environment or parameters, exiting');
      
      return;
    }

    console.log(`Minting NFT on ${contractAddress}`);

    const [owner] = await ethers.getSigners();
    const SnakeNFT = await ethers.getContractFactory('SnakeNFT');
    const snakeNFT = SnakeNFT.attach(contractAddress);
    await snakeNFT.mint(owner.address);
  });

module.exports = {};
