import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying Timelock contract with the account:", deployer.address);

    const Timelock = await ethers.getContractFactory("Timelock");
    const timelock = await Timelock.deploy("0x3786495F5d8a83B7bacD78E2A0c61ca20722Cce3");
     // Deploy the contract 

    console.log("Target set to:", timelock.target);

    // Target set to: 0x93A8f19cc316e5bf7deA31717d1e8FC0A6777cc5
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
