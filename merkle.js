const fs = require('fs');
const csv = require('csv-parser');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

const leaves = [];

// Read the CSV file
fs.createReadStream('MerkleCSV.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Hash each entry in the format keccak256(address, amount)
    const leaf = keccak256(row.address + row.amount);
    leaves.push(leaf);
  })
  .on('end', () => {
    // Construct the Merkle tree
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    // Get the Merkle root
    const root = tree.getHexRoot();

    console.log('Merkle Root:', root);

    // Optionally, you can save the root to a file
    fs.writeFileSync('merkle_root.txt', root);

    console.log('Merkle root has been saved to merkle_root.txt');
  });