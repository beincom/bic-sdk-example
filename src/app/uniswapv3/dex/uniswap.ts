import { UniswapAdapter, UniswapHelper } from "@beincom/dex";

export const uniswapHelper = new UniswapHelper({
  factoryAddress: process.env.NEXT_PUBLIC_UNISWAP_FACTORY_ADDRESS as string,
  providerUrl:
    "https://arbitrum-sepolia.rpc.thirdweb.com/e1f8d427e28ebc5bb4e5ab5c38e8d665",
});



export const uniswapAdapter = new UniswapAdapter({
  factoryAddress: process.env.NEXT_PUBLIC_UNISWAP_FACTORY_ADDRESS as string,
  routerAddress: process.env.NEXT_PUBLIC_UNISWAP_ROUTER_ADDRESS as string,
  providerUrl:
    "https://arbitrum-sepolia.rpc.thirdweb.com/e1f8d427e28ebc5bb4e5ab5c38e8d665",
});
