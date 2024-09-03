const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

describe("merkleroot", function () {
    let MerkleAirdrop, merkleAirdrop, Token, token, owner, addr1, addr2, addr3;
    let merkleTree, merkleRoot;

    const airdropData = [
        { account: "0x1111111111111111111111111111111111111111", amount: "100" },
        { account: "0x2222222222222222222222222222222222222222", amount: "200" },
        { account: "0x3333333333333333333333333333333333333333", amount: "300" },
    ];

    before(async function () {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Deploy the ERC20 token
        Token = await ethers.getContractFactory("MockERC20");
        token = await Token.deploy("MockToken", "MTK", ethers.utils.parseEther("1000000"));
        await token.deployed();

        // Generate Merkle Tree
        const leaves = airdropData.map(x =>
            ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [x.account, x.amount]))
        );
        merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        merkleRoot = merkleTree.getHexRoot();

        // Deploy MerkleAirdrop contract
        MerkleAirdrop = await ethers.getContractFactory("MerkleAirdrop");
        merkleAirdrop = await MerkleAirdrop.deploy(token.address, merkleRoot);
        await merkleAirdrop.deployed();

        // Transfer tokens to the airdrop contract
        await token.transfer(merkleAirdrop.address, ethers.utils.parseEther("1000"));
    });

    it("Should deploy the contract with correct initial values", async function () {
        expect(await merkleAirdrop.token()).to.equal(token.address);
        expect(await merkleAirdrop.merkleRoot()).to.equal(merkleRoot);
    });

    it("Should allow a valid claim", async function () {
        const claim = airdropData[0];
        const proof = merkleTree.getHexProof(ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [claim.account, claim.amount])
        ));

        await merkleAirdrop.claim(claim.amount, proof);

        expect(await token.balanceOf(claim.account)).to.equal(claim.amount);
        expect(await merkleAirdrop.hasClaimed(claim.account)).to.be.true;
    });

    it("Should reject an invalid proof", async function () {
        const claim = airdropData[1];
        const invalidProof = merkleTree.getHexProof(ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [claim.account, "1000"])
        ));

        await expect(merkleAirdrop.claim(claim.amount, invalidProof))
            .to.be.revertedWith("Invalid merkle proof");
    });

    it("Should prevent double claims", async function () {
        const claim = airdropData[0];
        const proof = merkleTree.getHexProof(ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [claim.account, claim.amount])
        ));

        await expect(merkleAirdrop.claim(claim.amount, proof))
            .to.be.revertedWith("Airdrop already claimed");
    });

    it("Should allow owner to update merkle root", async function () {
        const newMerkleRoot = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("new root"));
        await merkleAirdrop.updateMerkleRoot(newMerkleRoot);
        expect(await merkleAirdrop.merkleRoot()).to.equal(newMerkleRoot);
    });

    it("Should allow owner to withdraw remaining tokens", async function () {
        const initialBalance = await token.balanceOf(owner.address);
        await merkleAirdrop.withdrawRemainingTokens(owner.address);
        const finalBalance = await token.balanceOf(owner.address);

        expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("1000").sub(airdropData[0].amount));
    });

    it("Should prevent non-owner from updating merkle root", async function () {
        const newMerkleRoot = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("new root"));
        await expect(merkleAirdrop.connect(addr1).updateMerkleRoot(newMerkleRoot))
            .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent non-owner from withdrawing tokens", async function () {
        await expect(merkleAirdrop.connect(addr1).withdrawRemainingTokens(addr1.address))
            .to.be.revertedWith("Ownable: caller is not the owner");
    });
});