"use client"

import { useApp } from "@/src/context"
import { formatUnits } from "viem"

const TokenInfo = () => {
    const { 
        data: { tokenInfo },
        fn: { sendTokens, makeDeposit, makeValidate } 
    } = useApp()

    if (Object.keys(tokenInfo).length === 0)
        return null;

    console.log(tokenInfo)
    return (
        <div>
            <div>Symbol: {tokenInfo.symbol}</div>
            <div>Name: {tokenInfo.name}</div>
            <div>Balance: {formatUnits(tokenInfo.balance, tokenInfo.decimals)}</div>

            <div className="my-4">
                <button
                    type="button"
                    className="box-home w-48 font-semibold border text-slate-700 bg-yellow-500 text-center rounded-md py-3 px-6"
                    onClick={() => makeDeposit(50)}
                >
                    Deposit 50 {tokenInfo.symbol}
                </button>
            </div>
            <div className="my-4">
                <button
                    type="button"
                    className="box-home w-48 font-semibold border text-white bg-blue-500 text-center rounded-md py-3 px-6"
                    onClick={() => makeValidate() }
                >
                    Validate Deposit
                </button>
            </div>
        </div>
    )
}

export default TokenInfo