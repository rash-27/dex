// scripts/resetNetwork.js
async function main() {
    const { network } = require("hardhat");
  
    // Reset the Hardhat Network
    await network.provider.request({
      method: "hardhat_reset",
      params: [],
    });
  
    console.log("Hardhat Network reset successfully");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });