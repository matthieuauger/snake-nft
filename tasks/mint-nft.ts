import "@nomiclabs/hardhat-web3";
import { ethers } from "hardhat";
import { task } from "hardhat/config";

task("mint", "Mints a token")
  .addParam("private", "The private key")
  .addParam("address", "The address to receive a token")
  .addParam("contract", "The contract address")
  .setAction(async (taskArgs, { web3 }) => {
    const contract = require("../artifacts/contracts/SnakeNFT.sol/SnakeNFT.json")
    const nftContract = new web3.eth.Contract(contract.abi, taskArgs.contract)

    const nonce = await web3.eth.getTransactionCount(taskArgs.address, "latest") //get latest nonce

    const tx = {
      from: taskArgs.address,
      to: taskArgs.contract,
      nonce: nonce,
      gas: 500000,
      data: nftContract.methods.mint(taskArgs.address).encodeABI(),
    }
  
    const signedTx = await web3.eth.accounts.signTransaction(tx, taskArgs.private);

    if (typeof signedTx.rawTransaction === "undefined") {
      console.log('No raw transaction, exiting');
      return;
    }

    web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
      function (err, hash) {
        if (!err) {
          console.log(
            "The hash of your transaction is: ",
            hash,
          )
        } else {
          console.log(
            "Something went wrong when submitting your transaction:",
            err
          )
        }
      }
    );
  });

module.exports = {};
