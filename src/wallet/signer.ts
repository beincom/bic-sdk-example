import axios from "axios";

import { createBicSigner, } from '@beincom/signers/bic';
import { ArbitrumSepolia, deriveChain } from '@beincom/aa-sdk/chains';
import { createBicSmartAccount } from '@beincom/aa-sdk/smart-account';

import { createBicSmartAccountClient } from '@beincom/aa-sdk/client';
import { createSmartAccountController } from '@beincom/aa-coinbase';
import * as auth from "./auth";
import { BicSmartAccount } from "@/types";

import { MockSigner } from "./mock-signer";
import { BIC_ADDRESS } from "@/utils";



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


let coinbaseSmartAccount: Awaited<ReturnType<typeof createSmartAccountController>>;
export async function getCoinbaseSmartAccount() {
    if (coinbaseSmartAccount) return coinbaseSmartAccount
    const mpcAccount = new MockSigner();
    const token = await auth.getToken();
    if (!token) {
        throw new Error('token not found')
    }
    coinbaseSmartAccount = await createSmartAccountController(
        token,
        {
            debug: true,
            // bundlerUrl: 'https://arb-sepolia.g.alchemy.com/v2/gA53VZ-kip4A01xx5mT2pKG3FbpKO1OW',
            signer: mpcAccount,
            client: createBicSmartAccountClient({
                endpoint: endPointUrl,
                httpClient: auth.AxiosSingleton(),
            }),
            smartWalletAddress: null,
            passkeyCredential: "",
            chain: ArbitrumSepolia as any,
            // paymasterAddress: BIC_ADDRESS,
            // bicAddress: BIC_ADDRESS,
        })
    return coinbaseSmartAccount
}