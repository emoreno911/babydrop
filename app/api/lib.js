import { v4 as uuidv4 } from "uuid";
import { 
    socialWalletAddress,
    bbDropProtocolABI, 
    bbDropProtocolAddress, 
    socialWalletABI
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
        chainId,
        id,
        pwd,
        toAddress
    } = data;

    const contract = getContractInstance(
        bbDropProtocolAddress, 
        bbDropProtocolABI, 
        chainId
    );

    try {
        const result = await contract.write.executeClaim([
            id,
            pwd,
            toAddress
        ])
        logmessage(`=== Deposit claimed ${id}`);
        return {
            result
        }
    } catch (error) {
        console.log('=== claim error', error)
        return { error: true }
    }
}

export async function deploy(data) {
    const {
        chainId,
        socialid,
        pincode
    } = data;

    const contract = getContractInstance(
        bbDropProtocolAddress, 
        bbDropProtocolABI, 
        chainId
    );

    try {
        const walletImplementation = socialWalletAddress;
        const result = await contract.write.deploySocialWallet([
            walletImplementation,
            socialid,
            pincode
        ])

        logmessage(`=== Wallet deployed ${result}`);
        return {
            address: result
        } 
    } catch (error) {
        console.log('=== deploy error', error)
        return { error: true }
    }
}

export async function withdraw(data) {
    const {
        chainId,
        socialWalletAddr, 
        amount, 
        toAddress, 
        pincode, 
        contractAddr
    } = data;

    const contract = getContractInstance(
        socialWalletAddr, 
        socialWalletABI, 
        chainId
    );

    try {
        const isValidPin = await checkPinHash(contract, pincode);
        if (!isValidPin) {
            return {
                error: true,
                result: "INVALID_PINCODE"
            }
        }

        const result = await contract.write.withdrawToken([
            contractAddr,
            amount,
            toAddress
        ])

        logmessage(`=== Withdrawal success ${result}`);
        return {
            result
        } 
    } catch (error) {
        console.log('=== withdraw error', error)
        return { 
            error: true,
            result: "WITHDRAW_ERROR" 
        }
    }
}

async function checkPinHash(socialWalletContract, pincode) {
    const pinHash = await socialWalletContract.read.getPinHash();
    const pinHex = crypto.createHash('sha256').update(pincode).digest('hex');
    return `0x${pinHex}` === pinHash; // CHECK!!!
}