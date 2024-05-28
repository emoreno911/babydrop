import { v4 as uuidv4 } from 'uuid';
import { http, custom, parseUnits, getContract, createPublicClient } from "viem";


export const getContractInstance = (walletClient, contractAddr, abi, currentChain) => {
    const publicClient = createPublicClient({
        chain: currentChain,
        transport: http(),
    })

    const contract = getContract({
        address: contractAddr,
        abi,
        client: { public: publicClient, wallet: walletClient }
    })

    return contract
}

// get user babydoge balance
export const getTokenInfo = async (contract, userAddr) => {
    try {
        const symbol = await contract.read.symbol();
		const name = await contract.read.name();
		const decimals = await contract.read.decimals();
		const balance = await contract.read.balanceOf([userAddr])

        return {
			symbol,
			name,
			decimals,
			balance
		}       
    } catch (error) {
        console.log('getTokenInfo', error)
        return null
    }
}

export const makeTransaction = async (contract, tokenAmount, toAddress, decimals) => {
    const vmAmount = parseUnits(`${tokenAmount}`, decimals)

    try {
        const hash = await contract.write.transfer([toAddress, vmAmount])
		console.log(vmAmount, hash)
		return hash
    } catch (error) {
        console.log('makeTransaction', error)
        return null
    }
}

export const setDeposit = async (contract, data) => {
    const {amount, sender, contractAddr, hash} = data
    console.log(data)
    try {
        const id = uuidv4();
        const result = await contract.write.createDeposit([
            id,
            hash,
            amount,
            sender,
            contractAddr
        ])
        console.log(result)
        return {
            depositId: id,
            result
        }

    } catch (error) {
        console.log('setDeposit', error)
        return null
    }

}

export const validateClaim = async (contract, id, pwd) => {
    try {
        const result = await contract.read.validateClaim([id, pwd]);
        console.log(result)
        return result
    } catch (error) {
        console.log('validateClaim', error)
        return null
    }
}

// async function getSCWallet(socialid)

// api methods
// executeClaim
// deploySCWallet
// withdrawFromSCWallet