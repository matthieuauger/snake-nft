async function main() {
  const TheodoNFT = await ethers.getContractFactory("TheodoNFT")

  // Start deployment, returning a promise that resolves to a contract object
  const theodoNFT = await TheodoNFT.deploy()
  await theodoNFT.deployed()
  console.log("Contract deployed to address:", theodoNFT.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
