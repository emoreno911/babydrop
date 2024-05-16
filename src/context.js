import React, { createContext, useState, useEffect, useContext } from "react";
import { createWalletClient, http, custom, parseUnits, getContract, erc20Abi, createPublicClient } from "viem";
import { bsc, bscTestnet } from "viem/chains";
import { useAccount } from "wagmi";
import { helloStorageABI, helloStorageAddress } from "./constants";

const DataContext = createContext();
export const useApp = () => useContext(DataContext);

// https://www.quicknode.com/guides/ethereum-development/transactions/how-to-send-a-transaction-using-viem
const AppProvider = (props) => {
    const { isConnected, address } = useAccount();
    const [walletClient, setWalletClient] = useState(null);
	const [currentChain, setCurrentChain] = useState(bsc);
    const [loaderMessage, setLoaderMessage] = useState(null);
	const [tokenInfo, setTokenInfo] = useState({})

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

	const getContractInstance = (contractAddr, abi) => {
		const publicClient = createPublicClient({
			chain: currentChain,
			transport: http(),
		})

		// get user babydoge balance
		const contract = getContract({
			address: contractAddr, // WSG
			abi,
			client: { public: publicClient, wallet: walletClient }
		})

		return contract
	}

	const sayHelloBlockchain = async () => {
		console.log("fn sayHelloBlockchain");
		const contract = getContractInstance(helloStorageAddress, helloStorageABI)

		const message = await contract.read.sayHello();
		alert(message)
	}

	const getAccountData = async (address) => { 
		console.log("fn getAccountData");
		const contract = getContractInstance('0xa58950f05fea2277d2608748412bf9f802ea4901', erc20Abi);

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
		const contract = getContractInstance('0xa58950f05fea2277d2608748412bf9f802ea4901', erc20Abi);

		console.log(vmAmount)
		const hash = await contract.write.transfer([toAddress, vmAmount])

		console.log(vmAmount, hash)
		return hash
	}

    const data = {
        walletClient,
        loaderMessage,
		tokenInfo
    };

    const fn = {
        setLoaderMessage,
		sayHelloBlockchain,
		sendTokens
    };

    return (
        <DataContext.Provider value={{ data, fn }}>
            {props.children}
        </DataContext.Provider>
    );
};

export default AppProvider;