
import { PaymentService } from "@beincom/payments";
import { TOKEN_MESSAGE_EMITTER_ADDRESS } from "./constants";
import { getSmartAccount } from "@/wallet";

// Get env nhu DEX
export const paymentService = new PaymentService({
  tokenMessageEmitterAddress: TOKEN_MESSAGE_EMITTER_ADDRESS, 
  providerUrl:
    "https://arbitrum-sepolia.rpc.thirdweb.com/e1f8d427e28ebc5bb4e5ab5c38e8d665",
});


// const smartAccount = await getSmartAccount();
// const to = await smartAccount.client.getWalletByUserId("creatorUserId")
// const data = paymentService.transferERC20Message({
//   amount: "1123",
//   to:"0x123",
//   token: { address: "0x123", decimals: 18, name: "Token", symbol: "TKN" },
//   msg: JSON.stringify({ message: "This is a message" }),
// })


// smartAccount.buildAndSendUserOperation({ calldata: data.calldata }, true)

