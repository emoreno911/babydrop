import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/lib/firebase";
import { useApp } from "@/src/context";
import Modal from "../common/modal";
import SocialLogin from "../common/social-login";
import { makeHash } from "@/src/lib/myutils";


const ModalSocialWallet = ({ buttonText, item, disableClaim, setDisableClaim }) => {
    const { 
		fn:{ makeClaim }		 
	} = useApp();

    const [socialWalletAddr, setSocialWalletAddr] = useState(null);
	const [claimComplete, setClaimComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const pincodeInput = useRef();

    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            checkSocialWalletAddress();
        }
    }, [user])

    const checkSocialWalletAddress = async () => { 
        console.log("checking...")
    }

    const handleClaimTokens = async () => {
        const h = await makeHash("000000")
        console.log("checking hash...")
        console.log(h)
    }

    const helpText = socialWalletAddr === null ?
        "Generate a SocialWallet and get your tokens in it." : 
        `Send the tokens to your current SocialWallet`;

    const PinModule = () => (
        <div className="w-full relative my-5">
            <label className="text-white">Set a 6 digit pin code for your wallet</label>
            <input
                ref={pincodeInput}
                type="password"
                className="block w-full leading-normal flex-1 h-10 rounded-lg px-3 mt-1 relative text-gray-500" 
            />
            <small className="block text-gray-400">This code will be required for withdrawals</small>
            { errorMessage && <small className="block text-red-400 mt-2">{errorMessage}</small> }
        </div>
    )

    return (
        <Modal
			activator={({ setShow }) => (
				<button 
                    type="button" 
                    className="flex w-full text-center text-md px-5 py-2 my-5 text-white rounded-md bg-blue-500 focus:outline-none"
                    onClick={() => setShow(true)}
                > 
                    <span className="block mx-auto">{ buttonText }</span>    
                </button>
			)}
		>
            <div className="bg-slate-700 pt-4 pb-8 p-10 rounded-md text-white">
                {
                    !user ?
                    (
                        <>
                            <h4 className=" text-xl my-3">Claim with Social Account</h4>
                            <SocialLogin />
                        </> 
                    )
                    :
                    (
                        <div className="flex flex-col">
                            <h4 className=" text-xl mt-3">Claim with Social Account</h4>
                            <small className="text-gray-400">{helpText}</small>
                            <div className="mt-5">Social Account: <span className="text-gray-400">{user.email}</span></div>
                            {
                                (socialWalletAddr === null) && <PinModule />
                            }
                            {
                                !claimComplete ? (
                                    <button 
                                        type="button" 
                                        className="flex text-sm px-5 py-2 mt-5 text-white rounded-md bg-green-500 focus:outline-none"
                                        onClick={() => handleClaimTokens()}
                                    >
                                        <span className="block mx-auto text-md">
                                            { isProcessing ? "Processing..." : "Claim Tokens" }
                                        </span>
                                    </button>
                                ):
                                (
                                    <div className="text-center">
                                        <h4 className="text-xl font-bold my-5">Claim Completed!</h4>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <Link to={`/socialwallet`}>
                                                <span className="block text-md text-yellow-400">
                                                    Go to Social Wallet
                                                </span>
                                            </Link>
                                        </div>
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

export default ModalSocialWallet