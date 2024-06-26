"use client"

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "@/src/lib/firebase";
import { useApp } from "@/src/context";
import { formatBalance, isNullAddress } from "@/src/lib/myutils";
import { getTokenInfo } from "@/src/service";
import { babyDogeContactAddress } from "@/src/constants";
import { erc20Abi } from "viem";
import SocialLogin from "../common/social-login";
import WithdrawForm from "./withdraw-form";

const SocialWallet = () => {
    const { 
		fn:{ getSocialWalletAddress, getContractInstance }		 
	} = useApp();

    const [tokenInfo, setTokenInfo] = useState({ balance:0, decimals:0 });
    const [socialWalletAddr, setSocialWalletAddr] = useState(null);
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            checkSocialWalletAddress();
        }
    }, [user])

    const checkSocialWalletAddress = async () => { 
        let _socialWalletAddr = await getSocialWalletAddress(user.uid);
        let addr = isNullAddress(_socialWalletAddr) ? null : _socialWalletAddr;
        console.log(addr, _socialWalletAddr)
        setSocialWalletAddr(addr);

        if (addr !== null) {
            let contract = getContractInstance(babyDogeContactAddress, erc20Abi)
            let _tokenInfo = await getTokenInfo(contract, addr)
            setTokenInfo(_tokenInfo)
        }
    }

    return (
        <div className="w-full py-3 mx-auto flex flex-col items-center mt-12" style={{maxWidth:"540px"}}>
            {
                !user ?
                (
                    <div className="flex flex-col items-center justify-center text-center">
                        <p className="text-3xl pb-5 text-gray-300 font-semibold">Get a wallet linked to your social account</p>
                        <p className="text-xl py-5 text-gray-300">Use this wallet to send and receive tokens easely</p>
        
                        <div className="w-80">
                            <SocialLogin />
                        </div>
        
                    </div>
                )   
                :
                (
                    <>
                        <div className="dapp-title text-2xl pb-5">Social Wallet</div>
                        <div className="flex gap-2 w-full bg-slate-900 rounded-md p-5">
                            <img src={user.photoURL} className="w-20 h-20 mr-2" alt="" />
                            <div className="flex flex-col justify-center">
                                {/* <button className="bg-red-300" onClick={() => logout()} >Logout</button> */}
                                <p>{user.displayName}</p>
                                <p>{user.email}</p>
                                {
                                    socialWalletAddr !== null && (
                                        <div>
                                            <a 
                                                href={`https://bscscan.com/address/${socialWalletAddr}`} 
                                                className="text-yellow-400"
                                                target="_blank" 
                                            > 
                                                {socialWalletAddr}
                                            </a>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        {
                            socialWalletAddr === null ? 
                            (
                                <div className="text-center">
                                    <small className="mt-5 block text-gray-400">
                                        No wallet created for this user yet! <br/> 
                                        Claim a LINK to generate a Social Wallet
                                    </small>
                                    <Link href="/">
                                        <span className="text-yellow-500 text-sm">Back to home</span>
                                    </Link>
                                </div>
                            ) 
                            :
                            (                                    
                                <div className="w-full bg-slate-900 rounded-md p-5 mt-5">
                                    <div className="pb-0"> 
                                        <h3 className="text-xl font-bold pb-1">
                                            Your Wallet Balance
                                        </h3>
                                        <div className="font-mono text-xl text-gray-400">
                                            {formatBalance(tokenInfo.balance, tokenInfo.decimals)} {tokenInfo.symbol}
                                        </div>
                                    </div>

                                    <WithdrawForm 
                                        tokenInfo={tokenInfo}
                                        socialWalletAddr={socialWalletAddr}
                                    />

                                    <div className="pb-0">
                                        <Link href="/">
                                            <span className="text-yellow-500 text-sm">Back to home</span>
                                        </Link>
                                    </div>

                                </div> 
                            )
                        }
                    </>
                )
            }
        </div>
    )
        
}

export default SocialWallet