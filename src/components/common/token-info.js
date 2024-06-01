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
        // const res = await createDeposit({
        //     "hash": "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        //     "amount": 35,
        //     "sender": "0x312e4dc8DDefAa37361e330E4495e80B0D0509Db",
        //     "contractAddr": "0x9a01bf917477dD9F5D715D188618fc8B7350cd22",
        //     "chainId": 97
        // })

        const res = await deploySCWallet({msg:"hello"})

        console.log(res)
    }

    const localDeposits = listDeposits()
    const validateLast = async () => {
        const [a,t,id] = localDeposits[0].split("|")
        const result = await makeValidate(id.trim(), "")
        console.log(result)
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
                <pre>{localDeposits.join("")}</pre>
                <button
                    type="button"
                    className="box-home font-semibold text-white bg-blue-500 text-center rounded-md py-1 px-6 my-2"
                    onClick={() => validateLast() }
                >
                    Validate Last Deposit
                </button>

                <button
                    type="button"
                    className="block font-semibold text-white bg-purple-500 text-center rounded-md py-1 px-6 my-2"
                    onClick={() => dosomething()}
                >
                    Call create service
                </button>
            </div>
        </div>
    )
}

export default TokenInfo