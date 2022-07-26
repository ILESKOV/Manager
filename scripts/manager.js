const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const Manager = await hre.ethers.getContractFactory("Manager");
  const manager = await Manager.deploy(process.env.TOKEN_ADDRESS);
  await manager.deployed();

  console.log("Manager deployed to:", manager.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
