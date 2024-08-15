import {
  ETH_NATIVE_ADDRESS,
  ETH_WRAPPED_ADDRESS,
  UNISWAP_FACTORY_ADDRESS,
  UNISWAP_QUOTEV2_ADDRESS,
  UNISWAP_ROUTER_ADDRESS,
} from "@/utils";
import { UniswapAdapter, UniswapHelper } from "@beincom/dex";

export const uniswapHelper = new UniswapHelper({
  factoryAddress: UNISWAP_FACTORY_ADDRESS,
  ethNativeAddress: ETH_NATIVE_ADDRESS,
  ethWrappedAddress: ETH_WRAPPED_ADDRESS,
  multicall3Address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  providerUrl:
    "https://arbitrum-sepolia.rpc.thirdweb.com/e1f8d427e28ebc5bb4e5ab5c38e8d665",
  graphUrl:
    "https://api.studio.thegraph.com/query/75955/my-uniswapv3-arbitrum-sepolia/0.0.1",
});

export const uniswapAdapter = new UniswapAdapter({
  factoryAddress: UNISWAP_FACTORY_ADDRESS,
  routerAddress: UNISWAP_ROUTER_ADDRESS,
  ethNativeAddress: ETH_NATIVE_ADDRESS,
  ethWrappedAddress: ETH_WRAPPED_ADDRESS,
  quoterV2Address: UNISWAP_QUOTEV2_ADDRESS,
  providerUrl:
    "https://arbitrum-sepolia.rpc.thirdweb.com/e1f8d427e28ebc5bb4e5ab5c38e8d665",
});
