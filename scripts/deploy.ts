import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();


async function main() {
  const { BASE_TOKEN_URI, TOTAL_SUPPLY } = process.env;

  const SnakeNFT = await ethers.getContractFactory("SnakeNFT")

  // Start deployment, returning a promise that resolves to a contract object
  const snakeNFT = await SnakeNFT.deploy(BASE_TOKEN_URI, TOTAL_SUPPLY)
  await snakeNFT.deployed()
  console.log("Contract deployed to address:", snakeNFT.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
