import React, { createContext, useState, useEffect, useContext } from "react";
import { createWalletClient, http, custom, parseUnits, getAddress } from "viem";
import { bsc, bscTestnet } from "viem/chains";
//import { useAccount } from "wagmi";

const DataContext = createContext();
export const useApp = () => useContext(DataContext);

const AppProvider = (props) => {
	const address = "0x00";
    //const { isConnected, address } = useAccount();
    const [walletClient, setWalletClient] = useState(null);
    const [loaderMessage, setLoaderMessage] = useState(null);

    useEffect(() => {
        // if (!address) {
        //     setWalletClient(null);
        //     return;
        // }

        // // init account
        // const _walletClient = createWalletClient({
        //     chain: polygonMumbai,
        //     account: address,
        //     transport: window.ethereum ? custom(window.ethereum) : http(),
        // });

        // setWalletClient(_walletClient);
        // getUserData(address) // events from user
    }, [address]);

    const initAccountWithWallet = async () => {
        console.log("init accounts...");
    };

	const updateUIValues = async () => {
		console.log("fn updateUIValues");
	}

	const getAccountData = async (address, chainId) => { 
		console.log("fn getAccountData");
	}

	const sendTokens = async (
        contractAddress,
        tokenAmount,
        toAddress,
        decimals
    ) => { 
		console.log("fn sendTokens");
	}

    const data = {
        walletClient,
        loaderMessage,
    };

    const fn = {
        setLoaderMessage,
    };

    return (
        <DataContext.Provider value={{ data, fn }}>
            {props.children}
        </DataContext.Provider>
    );
};

export default AppProvider;