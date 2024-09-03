# Merkle Tree Airdrop System

This project implements a Merkle tree-based airdrop system for ERC20 tokens. It includes a script for generating the Merkle root from a CSV file, a smart contract for managing the airdrop, and test cases to ensure the system's reliability.

## Table of Contents

1. [Setup](#setup)
2. [Generating the Merkle Root](#generating-the-merkle-root)
3. [Deploying the MerkleAirdrop Contract](#deploying-the-merkleairdrop-contract)
4. [Generating Proofs for Claiming](#generating-proofs-for-claiming)
5. [Running Tests](#running-tests)
6. [Assumptions and Limitations](#assumptions-and-limitations)

## Setup

1. Clone this repository:
   ```
   git clone <repository-url>
   cd merkle-airdrop-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Generating the Merkle Root

The `merkle.js` script reads a CSV file of airdrop recipients and generates a Merkle root.

1. Prepare your CSV file:
   - Name it `airdrop.csv`
   - Format: `address,amount`
   - Example:
     ```
     0x1234...,100
     0x5678...,200
     ```

2. Run the script:
   ```
   node merkle.js
   ```

3. The script will output the Merkle root to the console and save it to `merkle_root.txt`.

## Deploying the MerkleAirdrop Contract

1. Set up your Hardhat environment:
   - Create a `.env` file with your private key and network details
   - Update `hardhat.config.js` with your network configurations

2. Deploy the contract:
   ```
   npx hardhat run scripts/deploy.js --network <your-network>
   ```

   Replace `<your-network>` with the network you're deploying to (e.g., `mainnet`, `rinkeby`).

3. The script will deploy the contract and output the contract address.

## Generating Proofs for Claiming

To generate proofs for users to claim their airdrop:

1. Create a script `generate-proof.js`:
   ```javascript
   const { MerkleTree } = require('merkletreejs');
   const keccak256 = require('keccak256');

   function generateProof(address, amount, airdropData) {
     const leaves = airdropData.map(x => 
       keccak256(Buffer.from(x.address.substr(2) + x.amount.toString(16).padStart(64, '0'), 'hex'))
     );
     const tree = new MerkleTree(leaves, keccak256, { sort: true });
     const leaf = keccak256(Buffer.from(address.substr(2) + amount.toString(16).padStart(64, '0'), 'hex'));
     return tree.getHexProof(leaf);
   }

   // Example usage
   const airdropData = [
     { address: '0x1234...', amount: 100 },
     { address: '0x5678...', amount: 200 },
   ];

   const proof = generateProof('0x1234...', 100, airdropData);
   console.log('Merkle Proof:', proof);
   ```

2. Run the script to generate a proof:
   ```
   node generate-proof.js
   ```

3. Users can use this proof to claim their airdrop by calling the `claim` function on the MerkleAirdrop contract.

## Running Tests

To run the test suite:

```
npx hardhat test
```

This will run all tests in the `test` directory.

## Assumptions and Limitations

1. CSV Format: The script assumes the CSV file is named `airdrop.csv` and has two columns: `address` and `amount`.

2. ERC20 Token: The MerkleAirdrop contract assumes the token follows the ERC20 standard.

3. Proof Generation: Users need to generate their proofs off-chain. The contract doesn't provide a method to generate proofs.

4. No Partial Claims: Users must claim their entire allocated amount in one transaction.

5. Immutable Allocations: Once the Merkle root is set, individual allocations cannot be changed without updating the entire Merkle tree.

6. Gas Costs: Large airdrops may result in a deep Merkle tree, increasing gas costs for proofs.

7. Frontend Integration: This README doesn't cover frontend integration for a user-friendly claiming process.

8. Security Considerations: Ensure proper access controls and testing before deploying with real tokens.

Remember to always test thoroughly on testnets before deploying to mainnet.