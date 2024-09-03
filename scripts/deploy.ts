//Script for deploying the MerkleRoot.sol

import { ethers } from "hardhat";
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    const merkleRootFac = await ethers.getContractFactory("merkleroot");
    await merkleRootFac.deploy("0x0850aC7A0Db7468816f5EbaFb0F10f6E1208126B", "0x0480d37a1a94eaada396833ca0c616fe9b8dfa1a9c29e3ffc58520c8164d82c6"); //used the token from my last project

    //address _token, bytes32 _merkleRoot

    //const merkleRootDeploy = await merkleRootFac.deploy();
    //console.log("Deployed to:", etherStakeDeploy.getAddress());
}
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

// ContractAddress: 0xef3B57eaEde0D1869d746bF559e358544B71A0f1 [verified]
// https://sepolia-blockscout.lisk.com/address/0xef3B57eaEde0D1869d746bF559e358544B71A0f1
