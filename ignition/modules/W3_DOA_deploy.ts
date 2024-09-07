import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const W3_DOAModule = buildModule("W3_DOAModule", (m) => {

    const erc20 = m.contract("W3_DOA");

    return { erc20 };
});

export default W3_DOAModule;

// W3_DOAModule#W3_DOA - 0x5D1B0151f3cd87DE162d4EeD63f8143c91b369f4 [Verified]