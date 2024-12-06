import { Account, Hex, PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";

interface ISigner {
    login(authRequest: any): Promise<void>;
    logout(): Promise<void>;
    signMessage(message: string | Uint8Array): Promise<string>;
    getAddress(): Promise<string>;
    getWalletInfo<T = { userId: string; status: any; address: string }>(): Promise<T>;
    isExistedDeviceShare(key: string, prefix?: string): Promise<boolean>;
    getViemAccount(): any;
}

export const owner0 = privateKeyToAccount("0x2009eb9389a24a9b471094bca5126f865ef21da8dea42d306520ec674675fa67");
export const owner1 = privateKeyToAccount("0xaf34e9967006853180bea9cd0d557e9f46c253b0ddc37181c91b76cad718fd26");
export const owner3 = privateKeyToAccount("0xcc0502397649f81dcbed56cb8ec6b022492fce2de97e9e6bb32944c58c0d1a0c");
export const owner2 = privateKeyToAccount("0x13e67a6b0dc27298c9efd43673ede7607c0e09edd745679888f940c15e0bc9b2");


export class MockSigner implements ISigner {
    private _account: PrivateKeyAccount = owner0

    public startSession(accessToken: string) {
        throw new Error("Method not implemented.");

    }

    public getWalletInfo<T = { userId: string; status: any; address: string; }>(): Promise<T> {
        throw new Error("Method not implemented.");
    }

    public async init(password: string, recoveryCode: string) {
        throw new Error("Method not implemented.");
    }

    public async login(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public logout(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async signMessage(message: string | Uint8Array): Promise<string> {
        console.log("🚀 ~ MockSigner ~ signMessage ~ message:", message)
        if (!this._account) {
            throw new Error("Account is not initialized.");
        }
        if (!this._account.signMessage) {
            throw new Error("signMessage method is not defined.");
        }
        const signature = this._account.signMessage({ message: message as string });
        const signature2 = this._account.signMessage({
            message: typeof message === "string" ? message : { raw: message },
        });
        console.log("🚀 ~ MockSigner ~ signMessage ~ signature2:", signature2)
        console.log("🚀 ~ MockSigner ~ signMessage ~ signature:", signature)
        return signature;
    }

    public async getAddress(): Promise<string> {
        return this._account.address;
    }

    public getViemAccount() {
        return this._account;
    }

    public isExistedDeviceShare(userId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

