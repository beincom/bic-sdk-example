import { createBicSmartAccount } from "@beincom/aa-sdk/smart-account";

export type BicSmartAccount = Awaited<ReturnType<typeof createBicSmartAccount>>;