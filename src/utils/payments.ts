
import { PaymentService } from "@beincom/payments";
import { PAYMENT_SERVICE_ADDRESS } from "./constants";

export const paymentService = new PaymentService({
  paymentServiceAddress: PAYMENT_SERVICE_ADDRESS,
  providerUrl:
    "https://arbitrum-sepolia.rpc.thirdweb.com/e1f8d427e28ebc5bb4e5ab5c38e8d665",
});

