import { injected } from "@wagmi/connectors";
import { cookieStorage, createConfig, createStorage, http } from "@wagmi/core";
import { bscTestnet, bsc } from "wagmi/chains";


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