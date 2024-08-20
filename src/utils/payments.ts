
import { PaymentService } from "@beincom/payments";
import { TOKEN_MESSAGE_EMITTER_ADDRESS } from "./constants";

export const paymentService = new PaymentService({
  tokenMessageEmitterAddress: TOKEN_MESSAGE_EMITTER_ADDRESS,
  providerUrl:
    "https://arbitrum-sepolia.rpc.thirdweb.com/e1f8d427e28ebc5bb4e5ab5c38e8d665",
});

