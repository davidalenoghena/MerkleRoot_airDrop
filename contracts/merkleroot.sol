// SPDX-License-Identifier: MIT

/*
#Create a smart contract named MerkleAirdrop that:
- Accepts an ERC20 token address and the Merkle root as constructor parameters.
- Allows users to claim their airdrop by providing their address, the amount, 
  and a valid Merkle proof.
- Verifies the proof against the stored Merkle root.
- Ensures that users can only claim their airdrop once.
- Emits an event when a successful claim is made.
- Provides functions for the contract owner to update the Merkle root 
  and withdraw any remaining tokens after the airdrop is complete.
*/
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract merkleRoot {
    //IERC20 public token;
    bytes32 public merkleRoot;

    address public owner;
    address public tokenAddress;

    mapping(address => bool) public hasClaimed;

    event AirdropClaimed(address indexed account, uint256 amount);
    event MerkleRootUpdated(bytes32 newMerkleRoot);

    constructor(address _token, bytes32 _merkleRoot) {
        owner = msg.sender;
        tokenAddress = _token;
        merkleRoot = _merkleRoot;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function claim(uint256 amount, bytes32[] calldata merkleProof) external {
        require(!hasClaimed[msg.sender], "Airdrop already claimed");
        
        // Verify the merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(merkleProof, merkleRoot, leaf), "Invalid merkle proof");

        // Mark as claimed
        hasClaimed[msg.sender] = true;

        // Transfer tokens
        require(IERC20(tokenAddress).transfer(msg.sender, amount), "Token transfer failed");

        emit AirdropClaimed(msg.sender, amount);
    }

    function updateMerkleRoot(bytes32 _newMerkleRoot) external onlyOwner {
        merkleRoot = _newMerkleRoot;
        emit MerkleRootUpdated(_newMerkleRoot);
    }

    function withdrawRemainingTokens(address to) external onlyOwner {
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        require(IERC20(tokenAddress).transfer(to, balance), "Token transfer failed");
    }
}