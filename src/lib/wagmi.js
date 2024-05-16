import { injected } from "@wagmi/connectors";
import { cookieStorage, createConfig, createStorage, http } from "@wagmi/core";
import { bscTestnet, bsc } from "wagmi/chains";

// https://github.com/staqeprotocol/interface/blob/main/wagmi.config.ts
// https://docs.bnbchain.org/docs/remix-new/

export const config = createConfig({
  chains: [bscTestnet, bsc],
  connectors: [injected()],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
//   transports: {
//     [bscTestnet.id]: http(),
//   },
});