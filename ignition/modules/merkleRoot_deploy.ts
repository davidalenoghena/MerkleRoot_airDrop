import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress = "0x5D1B0151f3cd87DE162d4EeD63f8143c91b369f4";
const merkleRoot_address = "0x0480d37a1a94eaada396833ca0c616fe9b8dfa1a9c29e3ffc58520c8164d82c6";

const merkleRootModule = buildModule("merkleRootModule", (m) => {

    //constructor(address _token, bytes32 _merkleRoot)
    const save = m.contract("merkleRoot", [tokenAddress, merkleRoot_address]);
    //const save = m.contract("merkleRoot", [tokenAddress]);

    return { save };
});

export default merkleRootModule;

// merkleRootModule#merkleRoot - 0x15ba7E49Ff14bDF94812328aC62B8A7ED8057F9B [Verified]
