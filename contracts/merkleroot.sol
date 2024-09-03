// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";

contract merkleroot {
    IERC20 public token;
    bytes32 public merkleRoot;
    address owner;
    mapping(address => bool) public hasClaimed;

    event AirdropClaimed(address indexed account, uint256 amount);
    event MerkleRootUpdated(bytes32 newMerkleRoot);

    constructor(address _token, bytes32 _merkleRoot) {
        owner = msg.sender;
        token = IERC20(_token);
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
        require(token.transfer(msg.sender, amount), "Token transfer failed");

        emit AirdropClaimed(msg.sender, amount);
    }

    function updateMerkleRoot(bytes32 _newMerkleRoot) external onlyOwner {
        merkleRoot = _newMerkleRoot;
        emit MerkleRootUpdated(_newMerkleRoot);
    }

    function withdrawRemainingTokens(address to) external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(to, balance), "Token transfer failed");
    }
}