import React, { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { useApp } from "@/src/context";
import Modal from "../common/modal";
import { isAddress } from "viem";


const ModalPairWallet = ({ buttonText, item, disableClaim, setDisableClaim }) => {
	const { 
		fn:{ makeClaim }		 
	} = useApp();

    const { connectors, connect } = useConnect();
    const { isConnected, address } = useAccount();
    
    const [inputAddress, setInputAddress] = useState("");
	const [claimComplete, setClaimComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const useMetamaskAddress = async () => {
        if (isConnected) {
            setInputAddress(address)
        }
        else {
            connect(
                { connector: connectors[0] }, 
                {
                    onSuccess: (data) => { setInputAddress(data.accounts[0]) },
                    onError: () => { console.log("wallet not connected") }
                }
            )
        }
    }

	const handleClaimTokens = async () => {
		if (disableClaim)
			return;

        setErrorMessage("");
        if (!isAddress(inputAddress)) {
            setErrorMessage("Wrong address format!")
            return;
        }

        setIsProcessing(true)
        let res = await makeClaim({address: inputAddress}, false);
        if (!res.error) {
            setClaimComplete(true)
            setDisableClaim(true)
        }
        
        setIsProcessing(false);
	}

	return (
		<Modal
			activator={({ setShow }) => (
				<button 
                    type="button" 
                    className="flex w-full text-center text-md px-5 py-2 my-5 text-white rounded-md bg-green-500 focus:outline-none"
                    onClick={() => setShow(true)}
                > 
                    <span className="block mx-auto">{ buttonText }</span>    
                </button>
			)}
		>
			<div className="bg-slate-700 pt-4 pb-8 px-8 rounded-md text-white">
                <h4 className=" text-xl my-3">Claim with Your Wallet</h4>
                <div className="w-full relative my-5">
                    <label className="text-white">Write your address or connect your Metamask wallet</label>
                    <div className="flex items-center mt-2">
                        <input
                            type="text"
                            className="block w-full leading-normal rounded-l-md flex-1 h-10 px-2 relative text-sm text-gray-600"
                            value={inputAddress}
                            onChange={e => setInputAddress(e.target.value)}
                        />
                        <button 
                            type="button" 
                            className="w-full px-2 rounded-r-md h-10 w-10 bg-gray-800 focus:outline-none"
                            onClick={() => useMetamaskAddress()}
                        >
                            <img src="/metamask.png" className="w-full" alt="metamask"/>
                        </button>
                    </div>
                    { errorMessage && <small className="block text-red-400 mt-2">{errorMessage}</small> }
                </div>
                {
                    !claimComplete ? (
                        <button 
                            type="button" 
                            className="w-full px-5 py-2 mt-4 rounded-md bg-green-500 focus:outline-none"
                            onClick={() => handleClaimTokens()}
                        >
                            <div>
                                <span className="block text-md">
                                    { isProcessing ? "Processing..." : "Claim Tokens" }
                                </span>
                            </div>
                        </button>
                    ):
                    (
                        <div>
                            <h4 className="text-xl font-bold my-4">Claim Completed!</h4>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )
                }
			</div>
		</Modal>
	)
}

export default ModalPairWallet