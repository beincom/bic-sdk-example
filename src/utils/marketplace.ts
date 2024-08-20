import { Marketplace } from "@beincom/marketplace";
import { MARKETPLACE_ADDRESS, ETH_NATIVE_ADDRESS } from "./constants";

export const marketplace = new Marketplace({
  marketplaceAddress: MARKETPLACE_ADDRESS,
  ethNativeAddress: ETH_NATIVE_ADDRESS,
  providerUrl:
    "https://arbitrum-sepolia.rpc.thirdweb.com/e1f8d427e28ebc5bb4e5ab5c38e8d665",
});
