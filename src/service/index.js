import { v4 as uuidv4 } from 'uuid';
import { parseUnits } from "viem";
import { postJSON } from '../lib/myutils';


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

export const makeTransaction = async (contract, tokenAmount, toAddress) => {
    try {
        const hash = await contract.write.transfer([toAddress, tokenAmount])
		console.log(tokenAmount, hash)
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

export const getSocialWallet = async (contract, socialid) => {
    try {
        const result = await contract.read.getSocialWallet([socialid]);
        console.log(result)
        return result
    } catch (error) {
        console.log('getSocialWallet', error)
        return null
    }
}

// async function getSCWallet(socialid)
// api methods
export const createDeposit = async (data) => {
    const response = await postJSON("/api", {
        fname: "create",
        data
    })

    console.log(response)
    return response
}

// executeClaim
export const executeClaim = async (data) => {
    const response = await postJSON("/api", {
        fname: "claim",
        data
    })

    console.log(response)
    return response
}

// deploySCWallet
export const deploySCWallet = async (data) => {
    const response = await postJSON("/api", {
        fname: "deploy",
        data
    })

    console.log(response)
    return response
}
// withdrawFromSCWallet