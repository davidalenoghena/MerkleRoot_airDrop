//Script for deploying the MerkleRoot.sol

import { ethers } from "hardhat";
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    const merkleRootFac = await ethers.getContractFactory("merkleroot");
    await merkleRootFac.deploy();

    //const merkleRootDeploy = await merkleRootFac.deploy();
    //console.log("Deployed to:", etherStakeDeploy.getAddress());
}
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

// ContractAddress: 
