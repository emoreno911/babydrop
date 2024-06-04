import { babyDogeContactAddress } from "@/src/constants";
import { useApp } from "@/src/context";
import { divideByDecimals, multiplyByDecimals } from "@/src/lib/myutils";
import { useState, useRef } from "react";
import { isAddress } from "viem";

const WithdrawForm = ({ tokenInfo, socialWalletAddr }) => {
    const [txid, setTxid] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const { fn:{ makeWithdrawal } } = useApp();

    const addressInput = useRef();
    const pincodeInput = useRef();

    const handleSubmit = async () => {
        if (isProcessing)
            return;

        setTxid("");
        const toAddress = addressInput.current.value;
        const pincode = pincodeInput.current.value;
        
        // Full withdrawal
        //const amount = tokenInfo.balance

        // Partial withdrawal
        const intAmountTotal = divideByDecimals(tokenInfo.balance.toString(), tokenInfo.decimals)
        const amount = multiplyByDecimals(intAmountTotal * 0.1, tokenInfo.decimals)
        
        if (toAddress === "" || pincode === "") {
            setErrorMessage("Fill all fields please");
            return;
        }

        if (!isAddress(toAddress)) {
            setErrorMessage("FInvalid address format");
            return;
        }

        // if (parseInt(amount) > tokenInfo.balance) {
        //     setErrorMessage("Insufficient balance");
        //     return;
        // }

        setIsProcessing(true);
        setErrorMessage("");

        let response = await makeWithdrawal({
            amount,
            pincode,
            toAddress,
            socialWalletAddr,
            contractAddr: babyDogeContactAddress
        });

        setIsProcessing(false);
        if (!response.error) {
            setTxid(response.result);
            setErrorMessage("");
        }
        else {
            if (response.result === "INVALID_PINCODE") {
                setErrorMessage("Invalid Pincode!");
            }
            else {
                setErrorMessage("Something went wrong! Try again.");
            }
            console.log(response)
        }
    }

    return (
        <>
            <div className="flex gap-1 items-center mt-5">
                <input
                    ref={addressInput}
                    type="text"
                    placeholder="to address"
                    className="block w-full leading-normal w-48 flex-1 h-9 rounded-md px-3 py-1 relative text-gray-500" 
                />
                <input
                    ref={pincodeInput}
                    type="password"
                    placeholder="pincode"
                    className="block w-full leading-normal w-32 flex-1 h-9 rounded-md px-3 py-1 relative text-gray-500" 
                />
                <button
                    type="button"
                    className="font-semibold text-slate-900 bg-yellow-500 text-center rounded-md py-2 px-6"
                    onClick={() => handleSubmit()}
                >
                    { isProcessing ? "Processing..." : "Withdraw All" }
                </button>
            </div>

            {
                txid !== "" && (
                    <div className="text-left my-2">
                        <a 
                            className="block text-sm text-blue-400"
                            href={`https://bscscan.com/tx/${txid}`} 
                            target="_blank"
                        >
                            Transaction ongoing. Check details
                        </a>
                    </div>
                )
            }

            <div className="pt-2 pb-5">
                { errorMessage && <small className="block text-red-400">{errorMessage}</small> }
            </div>
        </>
    )
}

export default WithdrawForm