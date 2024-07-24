import axios from "axios";

import { createBicSigner, } from '@beincom/signers/bic';
import { ArbitrumSepolia, deriveChain } from '@beincom/aa-sdk/chains';
import { createBicSmartAccount } from '@beincom/aa-sdk/smart-account';

import { createBicSmartAccountClient } from '@beincom/aa-sdk/client';
import * as auth from "./auth";
import { BicSmartAccount } from "@/types";



const chain = deriveChain(ArbitrumSepolia, {
    rpcUrl: 'https://arbitrum-sepolia.rpc.thirdweb.com/e1f8d427e28ebc5bb4e5ab5c38e8d665',
});

const endPointUrl = process.env.NEXT_PUBLIC_BIC_WALLET_ENDPOINT as string;

export const signer = createBicSigner({
    url: endPointUrl,
    maxRetries: 2,
    refreshSession: async () => {
        const session = await auth.getSession()
        if (!session?.refresh_token) {
            throw new Error('refresh token not found')
        }
        return session.id_token
    },
})
let smartAccount: BicSmartAccount;
export async function getSmartAccount() {
    if (smartAccount) return smartAccount

    const token = await auth.getToken()
    if (!token) {
        throw new Error('token not found')
    }
    smartAccount = await createBicSmartAccount(token, {
        client: createBicSmartAccountClient({
            endpoint: endPointUrl,
            httpClient: auth.AxiosSingleton(),
        }),
        signer,
        chain,
    })
    return smartAccount
}
