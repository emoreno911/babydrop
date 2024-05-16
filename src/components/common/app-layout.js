"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi";

const Navigation = () => {
    const { address: accountAddress, status, chainId } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    return (
        <header className="z-10 fixed top-0 left-0 w-full py-3 text-slate-100 bg-slate-900 dark:bg-slate-900">
            <div className="flex max-w-5xl w-full mx-auto">
                <div className="w-full flex items-center gap-1">
                    <img
                        className="w-auto h-6 -ml-1"
                        src="/favicon.png"
                        alt="App logo"
                    />
                    <span className="font-mono text-xl font-bold">
                        Babydrop
                    </span>
                </div>
                <div className="flex items-center mr-4">
                    {accountAddress ? (
                        <div className="font-mono">{`${accountAddress.slice(0, 5)}..${accountAddress.slice(accountAddress.length - 4)}`}</div>
                    ) : (
                        <button
                            onClick={() => connect({ connector: connectors[0] })}
                            className="border border-blue-500 bg-blue-400 text-center rounded-md py-1 px-6"
                        >
                            Connect
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

const AppLayout = ({ children }) => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between px-3 lg:px-24 py-8">
            <div className="z-10 max-w-5xl w-full text-sm pt-10">
                <Navigation />
                {children}
            </div>
        </main>
    )
}

export default AppLayout