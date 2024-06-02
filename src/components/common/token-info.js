"use client"

import { useApp } from "@/src/context"
import { listDeposits } from "@/src/lib/myutils"
import { createDeposit, deploySCWallet, executeClaim } from "@/src/service"
import { useRef, useState } from "react"
import { formatUnits } from "viem"

const TokenInfo = () => {
    const { 
        data: { tokenInfo },
        fn: { makeDeposit, makeValidate } 
    } = useApp()

    const [isProcessing, setIsProcessing] = useState(false);
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
            // navigate(`/tron/link/${response.depositId}`, { replace: true });
            console.log("Deposit ID", response.depositId)
        }
        else {
            alert("Something went wrong! Try again.");
        }
    }

    async function dosomething() {
        const res = await deploySCWallet({msg:"hello"})

        console.log(res)
    }

    const localDeposits = listDeposits()
    const showLink = async (row) => {
        const [a,t,id] = row.split("|")
        //console.log(`${window.location.origin}/link/${id.trim()}`)
        window.location.replace(`${window.location.origin}/link/${id.trim()}`)
    }

    if (Object.keys(tokenInfo).length === 0)
        return null;

    return (
        <div>
            <div>Symbol: {tokenInfo.symbol}</div>
            <div>Name: {tokenInfo.name}</div>
            <div>Balance: {formatUnits(tokenInfo.balance, tokenInfo.decimals)}</div>

            <div className="flex gap-1 items-center my-4">
                <input
                    ref={amountInput}
                    type="number"
                    placeholder="amount"
                    className="block w-full leading-normal w-32 flex-1 h-8 rounded-md px-3 mt-1 relative text-gray-500" 
                />
                <input
                    ref={passwordInput}
                    type="password"
                    placeholder="password"
                    className="block w-full leading-normal w-48 flex-1 h-8 rounded-md px-3 mt-1 relative text-gray-500" 
                />
                <button
                    type="button"
                    className="w-48 font-semibold text-slate-700 bg-yellow-500 text-center rounded-md py-2 px-6"
                    onClick={() => submitRequest()}
                >
                    { isProcessing ? "Processing..." : "Generate Link" }
                </button>
            </div>
            <div className="my-4">
                {
                    localDeposits.map(row => (
                        <div key={row} className="flex items-center gap-2 mb-2">
                            <div>{row}</div>
                            <div>
                                <button
                                    type="button"
                                    className="box-home font-semibold text-white text-xs bg-blue-500 text-center rounded-md py-1 px-6"
                                    onClick={() => showLink(row) }
                                >
                                    Show Link
                                </button>
                            </div>
                        </div>
                    ))
                }              

                <button
                    type="button"
                    className="block font-semibold text-white bg-purple-500 text-center rounded-md py-1 px-6 my-5"
                    onClick={() => dosomething()}
                >
                    Call Deploy service
                </button>
            </div>
        </div>
    )
}

export default TokenInfo