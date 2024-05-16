"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppProvider from "./context";
import { WagmiProvider } from "wagmi";
import { config } from "@/src/lib/wagmi";
import { useState } from "react";

export function Providers({ children }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <AppProvider>
                    {children}
                </AppProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
