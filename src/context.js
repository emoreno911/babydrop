import React, { createContext, useState, useEffect, useContext } from "react";
import { createWalletClient, http, custom, parseUnits, getContract, erc20Abi, createPublicClient, isAddress } from "viem";
import { useAccount } from "wagmi";
import { babyDogeContactAddress, bbDropProtocolABI, bbDropProtocolAddress, initialChain } from "./constants";
import { createDeposit, deploySCWallet, executeClaim, makeTransaction, validateClaim, getSocialWallet, withdrawFromSCWallet } from "./service";
import { divideByDecimals, makeHash, multiplyByDecimals, storeLocalDeposit } from "./lib/myutils";

const DataContext = createContext();
export const useApp = () => useContext(DataContext);

// https://www.quicknode.com/guides/ethereum-development/transactions/how-to-send-a-transaction-using-viem
const AppProvider = (props) => {
    const { isConnected, address } = useAccount();
    const [walletClient, setWalletClient] = useState(null);
	const [currentChain, setCurrentChain] = useState(initialChain);
    const [loaderMessage, setLoaderMessage] = useState(null);
	const [validatedData, setValidatedData] = useState({});
	const [tokenInfo, setTokenInfo] = useState({"symbol":"BabyDoge","name":"Baby Doge Coin","decimals":9,"balance":0})

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

	const getSocialWalletAddress = async (socialid) => {
		const protocolContract = getContractInstance(bbDropProtocolAddress, bbDropProtocolABI);
		const result = await getSocialWallet(protocolContract, socialid);
		return result;
	}

	const makeDeposit = async (amount, pwd = "") => {
		// transfer assets
		const vmAmount = parseUnits(`${amount}`, tokenInfo.decimals);

		const tokenContract = getContractInstance(babyDogeContactAddress, erc20Abi);
		let tokenTX = await makeTransaction(tokenContract, vmAmount, bbDropProtocolAddress)
		if (tokenTX === null) {
			console.log('fail TokenTX', tokenTX);
			return tokenTX;
		}

		let hash = await makeHash(pwd);
		let result = await createDeposit({
			hash,
			amount: multiplyByDecimals(amount, tokenInfo.decimals), 
			sender: address, 
			contractAddr: babyDogeContactAddress,
			chainId: currentChain.id
		})

		if (!result.error) {
			storeLocalDeposit(result.depositId, amount, tokenInfo.symbol, "", currentChain.name)
		}

		console.log('Deposit', result);
		//console.log('TokenTX', tokenTX);
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
			const decimalAmount = divideByDecimals(amount, tokenInfo.decimals)
			const result = {
				id,
				pwd, 
				sender, 
				isClaimed,
				amount: decimalAmount,
				tokenContractAddr
			}
			console.log(tokenInfo)
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
				console.log("socialWallet", socialWallet)

				if (socialWallet.error) {
					return socialWallet
				}

				// maybe the result was a tx hash instead the expected address
				if (!isAddress(socialWallet.address)) {
					alert("Transaction error, please refresh and try again")
					console.log("invalid social wallet address", {socialWallet})
					return { error: true }
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

	const makeWithdrawal = async (data) => {
		let result = await withdrawFromSCWallet({
			chainId: currentChain.id,
			...data
		});
		return result;
	}

    const data = {
		currentChain,
		validatedData,
        walletClient,
        loaderMessage,
		tokenInfo
    };

    const fn = {
		getContractInstance,
		getSocialWalletAddress,
		connectWalletAccount,
        setLoaderMessage,
		makeWithdrawal,
		makeValidate,
		makeDeposit,
		makeClaim
    };

    return (
        <DataContext.Provider value={{ data, fn }}>
            {props.children}
        </DataContext.Provider>
    );
};

export default AppProvider;