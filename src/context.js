import React, { createContext, useState, useEffect, useContext } from "react";
import { createWalletClient, http, custom, parseUnits, getContract, erc20Abi, createPublicClient, bytesToHex } from "viem";
import { bsc, bscTestnet } from "viem/chains";
import { useAccount } from "wagmi";
import { babyDogeContactAddress, bbDropProtocolABI, bbDropProtocolAddress, initialChain } from "./constants";
import { createDeposit, deploySCWallet, executeClaim, makeTransaction, setDeposit, validateClaim } from "./service";
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

    const connectWalletAccount = async () => {
        console.log("init accounts...");
    };

	const updateUIValues = async () => {
		console.log("fn updateUIValues");
	}

	const getContractInstance = (contractAddr, abi) => {
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
		const contract = getContractInstance(babyDogeContactAddress, erc20Abi);

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

	const makeDeposit = async (amount, pwd = "") => {
		// transfer assets
		const tokenContract = getContractInstance(babyDogeContactAddress, erc20Abi);
		let tokenTX = await makeTransaction(tokenContract, amount, bbDropProtocolAddress, tokenInfo.decimals)
		if (tokenTX === null) {
			console.log('fail TokenTX', tokenTX);
			return tokenTX;
		}

		let hash = await makeHash(pwd);
		let result = await createDeposit({
			hash,
			amount, 
			sender: address, 
			contractAddr: babyDogeContactAddress,
			chainId: currentChain.id
		})

		if (!result.error) {
			storeLocalDeposit(result.depositId, amount, tokenInfo.symbol, "", currentChain.name)
		}

		console.log('Deposit', result);
		console.log('TokenTX', tokenTX);
		return result;
	}

	const makeValidate = async (id, pwd) => {
		const protocolContract = getContractInstance(bbDropProtocolAddress, bbDropProtocolABI);
		let response = await validateClaim(protocolContract, id, pwd);
		
		if (response === null) {
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

	const makeClaim = async (data, isSocialWallet = false) => {
		if (Object.keys(validatedData).length === 0) // claim not validated
			return null;

		let toAddress = data.address;
		let newWallet = null;

		if (isSocialWallet) {
			const { socialid, pincode, address } = data;

			if (address !== null) {
				toAddress = address;
				newWallet = address;
			}
			else {
				let socialWallet = await deploySCWallet({
					chainId: currentChain.id,
					socialid,
					pincode
				})

				if (socialWallet.error) {
					return socialWallet
				}

				toAddress = socialWallet.address;
				newWallet = socialWallet.address;
			}
		}

		let result = await executeClaim({
			chainId: currentChain.id,
			id: validatedData.id,
			pwd: validatedData.pwd,
			toAddress,
		});

		if (!result.error) {
			setValidatedData({});
		}

		console.log('Claim Done', data, result);
		return {
			newWallet, 
			...result
		};
	}

    const data = {
		validatedData,
        walletClient,
        loaderMessage,
		tokenInfo
    };

    const fn = {
		connectWalletAccount,
        setLoaderMessage,
		makeDeposit,
		makeValidate,
		makeClaim
    };

    return (
        <DataContext.Provider value={{ data, fn }}>
            {props.children}
        </DataContext.Provider>
    );
};

export default AppProvider;