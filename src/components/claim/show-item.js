import { useEffect, useState } from "react";
import ModalPairWallet from "./modal-pair-wallet";
import ModalSocialWallet from "./modal-social-wallet";
import { divideByDecimals } from "@/src/lib/myutils";

const ShowItem = ({ item }) => {
    const { amount, sender, isClaimed, tokenContractAddr } = item
    const symbol = "BABYDOGE"
    const decimals = 9

    const [claimComplete, setClaimComplete] = useState(false);
    const [wasClaimed, setWasClaimed] = useState(isClaimed !== "0");
    const claimedText = wasClaimed ? "was already Claimed" : "is available for Claim";

    return (
        <div className="mt-12 p-5">
            <h4 className="text-xl text-center font-bold text-white mb-6">CLAIM TOKENS</h4>
            <div className="text-center">
                <input
                    type="number"
                    value={divideByDecimals(amount, decimals)}
                    readOnly={true}
                    className="bg-transparent text-white text-6xl text-center block border-b-2 w-1/2 mx-auto mb-3 focus:outline-none focus:border-yellow-500"
                />
                <span className="text-white text-3xl">{symbol}</span>
            </div>

            <div className="my-8">
                <div className="w-full md:w-3/4 max-w-lg mx-auto relative">
                    <h4 className='text-center text-gray-400 my-8'>
                        This deposit was created by {sender} and {claimedText}
                    </h4>
                    {
                        !wasClaimed && (
                            <>
                                <ModalPairWallet 
                                    buttonText={"Claim with Your Wallet"} 
                                    item={item}
                                    claimComplete={claimComplete}
                                    setClaimComplete={setClaimComplete}
                                />
                                <ModalSocialWallet 
                                    buttonText={"Claim with Social Account"} 
                                    item={item}
                                    claimComplete={claimComplete}
                                    setClaimComplete={setClaimComplete}
                                />
                            </>
                        )
                    }
                </div>
            </div>

        </div>
    )
}

export default ShowItem