import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useApp } from "@/src/context";
import Modal from "../common/modal";


const ModalPairWallet = ({ buttonText, item, disableClaim, setDisableClaim }) => {
	const { 
		fn:{ makeClaim, connectWalletAccount }		 
	} = useApp();

    const { isConnected, address } = useAccount();
	const [claimComplete, setClaimComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

	const handleClaimTokens = async () => {
		if (disableClaim)
			return;

        setIsProcessing(true)
        let res = await makeClaim(item);
        if (res.result !== null) {
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
                {
                    !isConnected ?
                    (
                        <button 
                            type="button" 
                            className="flex text-sm px-5 py-2 mt-5 text-white rounded-md bg-green-500 focus:outline-none"
                            onClick={() => connectWalletAccount()}
                        >
                            <div>
                                <span className="block text-md">Connect Wallet</span>
                            </div>
                        </button>
                    )
                    :
                    (
                        <div className="flex flex-col items-center justify-center">
                            <h4 className="block mt-6">
                                Connected to Account <span className="font-semibold text-yellow-400">{address}</span>
                            </h4>
                            {
                                !claimComplete ? (
                                    <button 
                                        type="button" 
                                        className="flex text-sm px-5 py-2 mt-5 text-white rounded-md bg-green-500 focus:outline-none"
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
                                        <h4 className="text-xl font-bold my-5">Claim Completed!</h4>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
			</div>
		</Modal>
	)
}

export default ModalPairWallet