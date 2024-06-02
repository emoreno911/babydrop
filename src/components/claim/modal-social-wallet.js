import React, { useState } from "react";
import { useApp } from "@/src/context";
import Modal from "../common/modal";
import SocialLogin from "../common/social-login";

const ModalSocialWallet = ({ buttonText, item, disableClaim, setDisableClaim }) => {

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
                <>
                    <h4 className=" text-xl my-3">Claim with Social Account</h4>
                    <SocialLogin />
                </> 
            </div>
        </Modal>
    )

}

export default ModalSocialWallet