import { v4 as uuidv4 } from "uuid";
import { 
    bbDropProtocolABI, 
    bbDropProtocolAddress 
} from "@/src/constants";
import { privateKeyToAccount } from 'viem/accounts'
import {
    createPublicClient, 
    createWalletClient,
    getContract,
    http,
} from "viem";
import { bsc, bscTestnet } from "viem/chains";

const logmessage = (str) => console.log('\x1b[33m%s\x1b[0m', str);

const getContractInstance = (contractAddr, abi, chainId) => {
    const account = privateKeyToAccount(process.env.BUILD_ACCOUNT_PK)
    const chain = chainId === 56 ? bsc : bscTestnet

    const walletClient = createWalletClient({
        chain,
        account,
        transport: http(),
    });

    const publicClient = createPublicClient({
        chain,
        transport: http(),
    })

    // get user babydoge balance
    const contract = getContract({
        abi,
        address: contractAddr,
        client: { public: publicClient, wallet: walletClient }
    })

    return contract
}

export async function create(data) {
    const {
        chainId,
        amount, 
        sender, 
        hash,
        contractAddr: tokenAddr 
    } = data;

    const contract = getContractInstance(
        bbDropProtocolAddress, 
        bbDropProtocolABI, 
        chainId
    );

    try {
        const id = uuidv4();
        const result = await contract.write.createDeposit([
            id,
            hash,
            amount,
            sender,
            tokenAddr
        ])

        logmessage(`=== Deposit created ${id}`);
        return {
            depositId: id,
            result
        }

    } catch (error) {
        console.log('=== deposit error', error)
        return { error: true }
    }
}

export async function claim(data) {
    const {
        chain,
        id,
        pwd,
        toAddress
    } = data;

    const contract = getContractInstance(
        bbDropProtocolABI, 
        bbDropProtocolAddress, 
        chain
    );

    try {
        const result = await contract.write.executeClaim([
            id,
            pwd,
            toAddress
        ])
        logmessage(`=== Deposit claimed ${id}`);
        return {
            depositId: id,
            result
        }
    } catch (error) {
        console.log('=== claim error', error)
        return { error: true }
    }
}

export async function deploy(data) {
    // const contract = getContractInstance(
    //     bbDropProtocolABI, 
    //     bbDropProtocolAddress, 
    //     chain
    // );

    const account = privateKeyToAccount(process.env.BUILD_ACCOUNT_PK)
    logmessage(`=== Account ${account.address}`);

    return {
        addr: account.address,
        data
    }
}

// walletAbi
export async function withdraw(data) {
    return {
        fn: "withdraw tokens",
        data
    }
}