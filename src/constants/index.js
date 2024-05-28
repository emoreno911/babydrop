import { bsc, bscTestnet } from 'viem/chains';

// https://chainide.com/s/ethereum
// export const wsbContract = "0xa58950f05fea2277d2608748412bf9f802ea4901"
// export const helloStorageAddress = "0xd11b886429b03c715a8b0fdcdc723239c9a17761";
// export const helloStorageABI = require('./HelloStorage.json');

export const initialChain = bscTestnet;
export const babyDogeContactAddress = initialChain === bsc ? 
    "0xc748673057861a797275cd8a068abb95a902e8de" : 
    "0x9a01bf917477dD9F5D715D188618fc8B7350cd22" ;

export const bbDropProtocolAddress = initialChain === bsc ? "0x0" : "0x82CD18691f14931724E74f98b9Ead660548587d4";
export const bbDropProtocolABI = require('./BBDropProtocol.json');