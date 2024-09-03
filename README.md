# Merkle Tree Airdrop System

This project implements a Merkle tree-based airdrop system for ERC20 tokens. It includes a script for generating the Merkle root from a CSV file, a smart contract for managing the airdrop, and test cases to ensure the system's reliability.

## Setup

1. Clone this repository:
   ```
   git clone https://github.com/davidalenoghena/MerkleRoot_airDrop.git
   cd MerkleRoot_airDrop
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Generating the Merkle Root

The `merkle.js` script reads a CSV file of airdrop recipients and generates a Merkle root.

1. Prepare your CSV file:
   - Name it `MerkleCSV.csv`
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
   - Create a `.env` file with your private key and network details. Copy from .env.example
   - Update `hardhat.config.js` with your network configurations

2. Deploy the contract:
   ```
   npx hardhat run scripts/deploy.js --network --lisk sepolia
   ```

3. The script will deploy the contract and output the contract address.

## Running Tests

To run the test suite:

```
npx hardhat test
```

This will run all tests in the `test` directory.

## Assumptions and Limitations

1. CSV Format: The script assumes the CSV file is named `MerleCSV.csv` and has two columns: `address` and `amount`.

2. ERC20 Token: The MerkleAirdrop contract assumes the token follows the ERC20 standard.

3. The user is using lisk sepolia chain

4. The user knows how to use git and an experienced Web3 developer will test these codes