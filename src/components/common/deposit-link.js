"use client"

import Link from "next/link";
import React, { useState } from "react";
import {
    EmailShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    EmailIcon,
    TelegramIcon,
    WhatsappIcon,
} from 'react-share';


const DepositLink = ({ id }) =>  {
    const [linkCopied, setLinkCopied] = useState(false);
    const linkResult = window.location.href.replace('link', 'claim');
    const title = "You got a magic link ";
    const iconSize = 48;

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(linkResult);
        setLinkCopied(true);
        setTimeout(() => {
            setLinkCopied(false);
        }, 2500);
    }

    return (
        <>
            <div className="flex flex-col text-center mt-12 p-5">
                <h3 className="text-xl font-bold">Here is your Link with Crypto!</h3>
                <div className="my-10">
                    <div className="flex flex-wrap items-stretch w-full max-w-xl mx-auto relative">
                        <input
                            type="text"
                            defaultValue={linkResult}
                            className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 h-10 rounded-lg rounded-r-none px-3 relative text-gray-500"
                        />

                        <div className="flex">
                            <button
                                title="Copy Link"
                                onClick={() => handleCopyToClipboard()}
                                className="flex items-center leading-normal rounded-l-none px-3 whitespace-no-wrap text-sm w-16 h-10 justify-center items-center text-md font-bold rounded-lg bg-yellow-600 text-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {linkCopied && <small className="text-yellow-500 ml-2 mt-2">Link Copied</small>}
                </div>

                <h3 className="text-xl font-bold">Send this link to a Friend</h3>
                <div className="my-5 mx-auto flex">
                    <WhatsappShareButton
                        url={linkResult}
                        title={title}
                        separator=":: "
                        className="mx-3"
                    >
                        <WhatsappIcon size={iconSize} round />
                    </WhatsappShareButton>

                    <TelegramShareButton
                        url={linkResult}
                        title={title}
                        className="mx-3"
                    >
                        <TelegramIcon size={iconSize} round />
                    </TelegramShareButton>

                    <EmailShareButton
                        url={linkResult}
                        subject={title}
                        body="body"
                        className="mx-3"
                    >
                        <EmailIcon size={iconSize} round />
                    </EmailShareButton>
                </div>
                <div className="mt-5">
                    <Link href="/">
                        <span className="text-yellow-500 text-sm">Back to home</span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default DepositLink;