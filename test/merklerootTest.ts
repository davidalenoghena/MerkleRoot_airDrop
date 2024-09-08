//const { expect } = require("chai");
//const { ethers } = require("hardhat");
//const { MerkleTree } = require("merkletreejs");
//const keccak256 = require("keccak256");

import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

const merkleRoot_address = "0x0480d37a1a94eaada396833ca0c616fe9b8dfa1a9c29e3ffc58520c8164d82c6";

describe("merklerootTest", function () {
    //let MerkleAirdrop, merkleAirdrop, Token, token, owner, addr1, addr2, addr3;
    //let merkleTree, merkleRoot;

    //const airdropData = [
    //    { account: "0x1111111111111111111111111111111111111111", amount: "100" },
    //    { account: "0x2222222222222222222222222222222222222222", amount: "200" },
    //];
    async function deployToken() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const erc20Token = await hre.ethers.getContractFactory("W3_DOA");
        const token = await erc20Token.deploy();

        //const token = await ethers.deployContract("W3_DOA");
        //await token.waitForDeployment();

        return { token };
    }

    async function deploy_merkleRoot() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const { token } = await loadFixture(deployToken);
        const merkleRoot_address = "0x0480d37a1a94eaada396833ca0c616fe9b8dfa1a9c29e3ffc58520c8164d82c6";

        const merkleRoot = await hre.ethers.getContractFactory("merkleRoot");
        const merkleRootDeploy = await merkleRoot.deploy(token, merkleRoot_address);    

        //const merkleRootDeploy = await ethers.deployContract("merkleRoot", [token, merkleRoot_address]);
        //await merkleRootDeploy.waitForDeployment();

        return { merkleRootDeploy, owner, otherAccount, token };
    }
    //before(async function () {
    //    [owner, addr1, addr2] = await ethers.getSigners();

    //    // Deploy the ERC20 token
    //    Token = await ethers.getContractFactory("MockERC20");
    //    token = await Token.deploy("MockToken", "MTK", ethers.utils.parseEther("1000000"));
    //    await token.deployed();

    //    // Generate Merkle Tree
    //    const leaves = airdropData.map(x =>
    //        ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [x.account, x.amount]))
    //    );
    //    merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    //    merkleRoot = merkleTree.getHexRoot();

    //    // Deploy MerkleAirdrop contract
    //    MerkleAirdrop = await ethers.getContractFactory("MerkleAirdrop");
    //    merkleAirdrop = await MerkleAirdrop.deploy(token.address, merkleRoot);
    //    await merkleAirdrop.deployed();

    //    // Transfer tokens to the airdrop contract
    //    await token.transfer(merkleAirdrop.address, ethers.utils.parseEther("1000"));
    //});
    describe("Deployment", function () {
        it("Should check if owner is correct", async function () {
            const { merkleRootDeploy, owner } = await loadFixture(deploy_merkleRoot);

            expect(await merkleRootDeploy.owner()).to.equal(owner);
        });

        it("Should check if tokenAddress is correctly set", async function () {
            const { merkleRootDeploy, owner, token } = await loadFixture(deploy_merkleRoot);

            expect(await merkleRootDeploy.tokenAddress()).to.equal(token);
        });

        it("Should check if merkle root is correct", async function () {
            const { merkleRootDeploy, owner, token } = await loadFixture(deploy_merkleRoot);

            expect(await merkleRootDeploy.merkleRoot()).to.equal(merkleRoot_address);
        });
    });
    describe("Claim", function () {
        it("Should claim successfully", async function () { });
        it("Should emit an event after successful claiming", async function () { });
    });
    describe("Merkle Update", function () {
        it("Should update the merkle root successfully", async function () { });
        it("Should withdraw any remaining tokens successfully", async function () { });
    });







    //it("Should deploy the contract with correct initial values", async function () {
    //    expect(await merkleAirdrop.token()).to.equal(token.address);
    //    expect(await merkleAirdrop.merkleRoot()).to.equal(merkleRoot);
    //});

    //it("Should allow a valid claim", async function () {
    //    const claim = airdropData[0];
    //    const proof = merkleTree.getHexProof(ethers.utils.keccak256(
    //        ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [claim.account, claim.amount])
    //    ));

    //    await merkleAirdrop.claim(claim.amount, proof);

    //    expect(await token.balanceOf(claim.account)).to.equal(claim.amount);
    //    expect(await merkleAirdrop.hasClaimed(claim.account)).to.be.true;
    //});

    //it("Should reject an invalid proof", async function () {
    //    const claim = airdropData[1];
    //    const invalidProof = merkleTree.getHexProof(ethers.utils.keccak256(
    //        ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [claim.account, "1000"])
    //    ));

    //    await expect(merkleAirdrop.claim(claim.amount, invalidProof))
    //        .to.be.revertedWith("Invalid merkle proof");
    //});

    //it("Should prevent double claims", async function () {
    //    const claim = airdropData[0];
    //    const proof = merkleTree.getHexProof(ethers.utils.keccak256(
    //        ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [claim.account, claim.amount])
    //    ));

    //    await expect(merkleAirdrop.claim(claim.amount, proof))
    //        .to.be.revertedWith("Airdrop already claimed");
    //});

    //it("Should allow owner to update merkle root", async function () {
    //    const newMerkleRoot = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("new root"));
    //    await merkleAirdrop.updateMerkleRoot(newMerkleRoot);
    //    expect(await merkleAirdrop.merkleRoot()).to.equal(newMerkleRoot);
    //});

    //it("Should allow owner to withdraw remaining tokens", async function () {
    //    const initialBalance = await token.balanceOf(owner.address);
    //    await merkleAirdrop.withdrawRemainingTokens(owner.address);
    //    const finalBalance = await token.balanceOf(owner.address);

    //    expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("1000").sub(airdropData[0].amount));
    //});

    //it("Should prevent non-owner from updating merkle root", async function () {
    //    const newMerkleRoot = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("new root"));
    //    await expect(merkleAirdrop.connect(addr1).updateMerkleRoot(newMerkleRoot))
    //        .to.be.revertedWith("Ownable: caller is not the owner");
    //});

    //it("Should prevent non-owner from withdrawing tokens", async function () {
    //    await expect(merkleAirdrop.connect(addr1).withdrawRemainingTokens(addr1.address))
    //        .to.be.revertedWith("Ownable: caller is not the owner");
    //});
});