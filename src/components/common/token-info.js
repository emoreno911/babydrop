"use client"

import Link from "next/link"
import { useApp } from "@/src/context"
import { useRef, useState } from "react"
import { formatUnits } from "viem"
import ModalMyLinks from "./modal-links"
import { useAccount, useConnect } from "wagmi"
import { toFixedIfNecessary } from "@/src/lib/myutils"

const TokenInfo = () => {
    const { 
        data: { tokenInfo },
        fn: { makeDeposit, makeValidate } 
    } = useApp()

    const { isConnected } = useAccount();
    const { connectors, connect } = useConnect();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const amountInput = useRef();
    const passwordInput = useRef();

    const submitRequest = async () => {
        const pwd = passwordInput.current.value;
        const amount = parseFloat(amountInput.current.value);
        const balance = formatUnits(tokenInfo.balance, tokenInfo.decimals);

        if (isProcessing)
            return;

        if (amount > parseFloat(balance)) {
            setErrorMessage("Insufficient balance");
            return;
        }

        setIsProcessing(true);
        const response = await makeDeposit(amount, pwd);

        setIsProcessing(false);
        if (response !== null) {
            window.location.replace(`/link/${response.depositId}`);
            //console.log("Deposit ID", response.depositId)
        }
        else {
            alert("Something went wrong! Try again.");
        }
    } 

    const formatBalance = (balance, decimals) => {
        const b = formatUnits(balance, decimals)
        const c = toFixedIfNecessary(b, 2);

        return new Intl.NumberFormat().format(c)
    }
    
    if (!isConnected)
        return (
            <button
                type="button"
                className="w-full font-semibold text-lg bg-blue-500 text-center rounded-md py-3 px-6 mt-5"
                onClick={() => connect({ connector: connectors[0] })}
            >
                Generate Your First Link
            </button>
        );

    if (Object.keys(tokenInfo).length === 0)
        return null;

    return (
        <>
            <div className="w-full bg-slate-900 rounded-md p-5 mt-5">
                <div className="pb-0"> 
                    <h3 className="text-xl font-bold pb-1">
                        Your Balance
                    </h3>
                    <div className="font-mono text-xl text-gray-400">
                        {formatBalance(tokenInfo.balance, tokenInfo.decimals)} {tokenInfo.symbol}
                    </div>
                </div>

                <div className="flex gap-1 items-center mt-5">
                    <input
                        ref={amountInput}
                        type="number"
                        placeholder="amount"
                        className="block w-full leading-normal w-48 flex-1 h-9 rounded-md px-3 py-1 relative text-gray-500" 
                    />
                    <input
                        ref={passwordInput}
                        type="password"
                        placeholder="password"
                        className="block w-full leading-normal w-32 flex-1 h-9 rounded-md px-3 py-1 relative text-gray-500" 
                    />
                    <button
                        type="button"
                        className="font-semibold text-slate-900 bg-yellow-500 text-center rounded-md py-2 px-6"
                        onClick={() => submitRequest()}
                    >
                        { isProcessing ? "Processing..." : "Generate Link" }
                    </button>
                </div>

                <div className="pt-2 pb-5">
                    { errorMessage && <small className="block text-red-400">{errorMessage}</small> }
                </div>

                <div className="pb-0">
                    <a href="https://babydogeswap.com/swap" target="_blank" className="text-yellow-500 text-sm">
                        Get some BabyDoge at babydogeswap.com
                    </a>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-5 w-full">
                    <ModalMyLinks buttonText="Your Links" />
                    <Link href="/socialwallet" className="flex-grow">
                        <div
                            className="font-semibold bg-purple-500 text-center rounded-md py-2 px-6"
                        >
                            Social Wallet
                        </div>
                    </Link>
            </div>
        </>
    )
}

export default TokenInfo