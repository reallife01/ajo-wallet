// import { ethers } from "hardhat";

// async function toks() {
//   const [deployer] = await ethers.getSigners();

//   console.log("Deploying contracts with the account:", deployer.address);

//   const AjoToken = await ethers.getContractFactory("AjoToken");
//   const ajoToken = await AjoToken.deploy(1000); 
//   console.log("Target set to:", AjoToken.target);

//       // Target set to: 0xf37090E69986dcBd81aB330728cA3857c8Ed65b6


// }

// toks()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });


const hre = require("hardhat");

async function main() {
  const AjoToken = await hre.ethers.getContractFactory("AjoToken");
  const ajoToken = await AjoToken.deploy();

  await ajoToken.deployed();
  console.log("Storage contract deployed to:", ajoToken.address);

  console.log("call retrieve():", await ajoToken.retrieve())

  console.log("call store(), set value to 100")
  const tx = await ajoToken.store(100)
  await tx.wait()
  
  console.log("call retrieve() again:", await ajoToken.retrieve())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});