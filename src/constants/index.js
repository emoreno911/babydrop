import { bsc, bscTestnet } from 'viem/chains';

// https://chainide.com/s/ethereum
export const initialChain = bscTestnet;
export const babyDogeContactAddress = initialChain === bsc ? 
    "0xc748673057861a797275cd8a068abb95a902e8de" : 
    "0x9a01bf917477dD9F5D715D188618fc8B7350cd22" ;

export const bbDropProtocolAddress = initialChain === bsc ? "0x0" : "0x0a195d17721727a4e723968682c92d40153c99F1";
export const bbDropProtocolABI = require('./BBDropProtocol.json');

export const socialWalletAddress = initialChain === bsc ? "0x0" : "0xaEbD28E567245e7fBA4bF3D7Cc068Fd0c35C93B8";
export const socialWalletABI = require('./SocialWallet.json');