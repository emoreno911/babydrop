import React, { createContext, useState, useEffect, useContext } from "react";
import { createWalletClient, http, custom, parseUnits, getContract, erc20Abi, createPublicClient, bytesToHex } from "viem";
import { bsc, bscTestnet } from "viem/chains";
import { useAccount } from "wagmi";
import { babyDogeContactAddress, bbDropProtocolABI, bbDropProtocolAddress, initialChain, wsbContract } from "./constants";
import { getContractInstance, makeTransaction, setDeposit, validateClaim } from "./service";
import { makeHash, storeLocalDeposit } from "./lib/myutils";

const DataContext = createContext();
export const useApp = () => useContext(DataContext);

// https://www.quicknode.com/guides/ethereum-development/transactions/how-to-send-a-transaction-using-viem
const AppProvider = (props) => {
    const { isConnected, address } = useAccount();
    const [walletClient, setWalletClient] = useState(null);
	const [currentChain, setCurrentChain] = useState(initialChain);
    const [loaderMessage, setLoaderMessage] = useState(null);
	const [tokenInfo, setTokenInfo] = useState({})
	const [validatedData, setValidatedData] = useState({});

    useEffect(() => {
        if (!address) {
            setWalletClient(null);
            return;
        }

        // init account
        const _walletClient = createWalletClient({
            chain: currentChain,
            account: address,
            transport: window.ethereum ? custom(window.ethereum) : http(),
        });

        setWalletClient(_walletClient);
        getAccountData(address) // events from user
    }, [address]);

    const initAccountWithWallet = async () => {
        console.log("init accounts...");
    };

	const updateUIValues = async () => {
		console.log("fn updateUIValues");
	}

	const getContractInstanceXYZ = (contractAddr, abi) => {
		const publicClient = createPublicClient({
			chain: currentChain,
			transport: http(),
		})

		// get user babydoge balance
		const contract = getContract({
			address: contractAddr,
			abi,
			client: { public: publicClient, wallet: walletClient }
		})

		return contract
	}

	const getAccountData = async (address) => { 
		console.log("fn getAccountData");
		// const contract = getContractInstance(
		// 	walletClient,
		// 	babyDogeContactAddress, 
		// 	erc20Abi,
		// 	currentChain
		// );
		const contract = getContractInstanceXYZ(babyDogeContactAddress, erc20Abi);

		const symbol = await contract.read.symbol();
		const name = await contract.read.name();
		const decimals = await contract.read.decimals();
		const balance = await contract.read.balanceOf([address])
		setTokenInfo({
			symbol,
			name,
			decimals,
			balance
		})
	}

	const sendTokens = async (
        tokenAmount = 50,
        toAddress = "0x21a0Ba775050F4E7EC70952093ef4c799a5f0d6b"
    ) => { 
		console.log("fn sendTokens");
		const vmAmount = parseUnits(`${tokenAmount}`, tokenInfo.decimals)
		const contract = getContractInstanceXYZ(babyDogeContactAddress, erc20Abi);

		console.log(vmAmount)
		const hash = await contract.write.transfer([toAddress, vmAmount])

		console.log(vmAmount, hash)
		return hash
	}

	const makeDeposit = async (amount) => {
		// transfer assets
		const tokenContract = getContractInstanceXYZ(babyDogeContactAddress, erc20Abi);
		let tokenTX = await makeTransaction(tokenContract, amount, bbDropProtocolAddress, tokenInfo.decimals)
		if (tokenTX === null) {
			console.log('TokenTX', tokenTX);
			return tokenTX;
		}

		const protocolContract = getContractInstanceXYZ(bbDropProtocolAddress, bbDropProtocolABI);
		let hash = await makeHash("");
		let result = await setDeposit(protocolContract, {
			amount, 
			sender: address, 
			contractAddr: babyDogeContactAddress, 
			hash
		});

		storeLocalDeposit(result.depositId, amount, tokenInfo.symbol, tokenTX)
		console.log('Deposit', result);
		console.log('TokenTX', tokenTX);
		return result;
	}

	const makeValidate = async () => {
		const protocolContract = getContractInstanceXYZ(bbDropProtocolAddress, bbDropProtocolABI);
		let response = await validateClaim(protocolContract, "794cc623-24af-4c69-a1c3-a20f7847ef7b", "")
		if (response === null) {
			alert("Invalid password")
			return null;
		}
		else {
			const [deposit, tokenContractAddr] = response;
			const [amount, sender, isClaimed] = deposit.split('|')
			const result = {
				amount, 
				sender, 
				isClaimed,
				tokenContractAddr
			}
			setValidatedData(result)
			return result;
		}
	}

	const makeClaim = async () => {}

    const data = {
        walletClient,
        loaderMessage,
		tokenInfo
    };

    const fn = {
        setLoaderMessage,
		sendTokens,
		makeDeposit,
		makeValidate
    };

    return (
        <DataContext.Provider value={{ data, fn }}>
            {props.children}
        </DataContext.Provider>
    );
};

export default AppProvider;