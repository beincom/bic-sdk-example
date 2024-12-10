"use client";

import { AuthSession } from "@/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { createSmartAccountController } from "@beincom/aa-coinbase";
import { getCoinbaseSmartAccount } from "@/wallet";
import { Address, getAddress, Hex, isAddress, zeroAddress } from "viem";
import { owner0, owner1 } from "@/wallet/mock-signer";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { BIC_ADDRESS, NFT_ADDRESS, USDT_ADDRESS } from "@/utils";
import LoginForm from "@/components/LoginForm";
import { NFTEntity, NFTType } from "@beincom/aa-sdk";


enum SignerType {
  MPC = "mpc",
  EXTERNAL = "EXTERNAL",
}
const CoinbasePage = () => {
  const DEFAULT_TO_ADDRESS = "0xeaBcd21B75349c59a4177E10ed17FBf2955fE697";
  const [session] = useLocalStorage<AuthSession | null>("session", null);
  const [smartAccount, setSmartAccount] =
    useState<Awaited<ReturnType<typeof createSmartAccountController>>>();
  const [smartAddress, setSmartAddress] = useState<Address>();
  const [owners, setOwners] = useState<{ owner: Address; index: bigint }[]>([]);
  const [newOwnerAddress, setNewOwnerAddress] = useState<Address>(
    "0xeaBcd21B75349c59a4177E10ed17FBf2955fE697"
  );
  const [txId, setTxId] = useState<Hex>();
  const [signerType, setSignerType] = useState<SignerType>(SignerType.MPC);
  const [isSimulate, setIsSimulate] = useState<boolean>(true);

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { address: currentAddress } = useAccount();

  useEffect(() => {
    if(!smartAccount) { return }
    const eventName = "transaction_receipt";
    smartAccount?.on(eventName, (data: any) => {
      console.log("Transaction receipt: ", data);
      setTxId(data.data.transactionHash);
    });
    return () => {
      smartAccount.off(eventName, (data: any) => {
        console.log("Event off: ", data);
      });
    };
  }, [smartAccount]);

  useEffect(() => {
    if (session) {
      getCoinbaseSmartAccount().then((account) => {
        setSmartAccount(account);
      });
    }
  }, [session]);

  const initData = async () => {
    if (!smartAccount) {
      return zeroAddress;
    }
    const coinbase = await smartAccount?.getAccount();
    setSmartAddress(coinbase.address);
    const owners = await smartAccount.getOwners();
    console.log("🚀 ~ initData ~ owners:", owners);
    setOwners(owners);
  };

  useEffect(() => {
    initData();
  }, [smartAccount]);

  const keepOwners = async () => {
    if (!smartAccount) {
      return;
    }

    const newOwner = privateKeyToAccount(generatePrivateKey());

    const data = await smartAccount.getKeepOnlyOwnersCalldata([
      newOwner.address,
      owner0.address,
      currentAddress as Address,
    ]);
    console.log("🚀 ~ keepOwners ~ data:", data);
    if (signerType === SignerType.EXTERNAL) {
      const hash = await walletClient?.sendTransaction({
        to: smartAccount.getSmartAddress(),
        data: data.callData,
      });
      if (!hash) {
        console.log("🚀 ~ removeOwner ~ hash:", hash);
        return;
      }
      console.log("🚀 ~ removeOwner ~ hash:", hash);
      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: hash,
      });
      console.log("🚀 ~ removeOwner ~ receipt:", receipt);
    }
    if (signerType === SignerType.MPC) {
      const receipt = await smartAccount.executeTransactionWithCallData(
        data,
        isSimulate
      );
      console.log("🚀 ~ addOwner ~ receipt:", receipt);
    }
    initData();
  };

  const addOwner = async () => {
    if (!smartAccount) {
      return;
    }
    if (!isAddress(newOwnerAddress)) {
      console.log("Invalid address");
      return;
    }

    const data = await smartAccount.getAddOwnersCalldata([newOwnerAddress]);
    if (signerType === SignerType.EXTERNAL) {
      const hash = await walletClient?.sendTransaction({
        to: smartAccount.getSmartAddress(),
        data: data.callData,
      });
      if (!hash) {
        console.log("🚀 ~ removeOwner ~ hash:", hash);
        return;
      }
      console.log("🚀 ~ removeOwner ~ hash:", hash);
      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: hash,
      });
      console.log("🚀 ~ removeOwner ~ receipt:", receipt);
    }
    if (signerType === SignerType.MPC) {
      const receipt = await smartAccount.executeTransactionWithCallData(
        data,
        isSimulate
      );
      console.log("🚀 ~ addOwner ~ receipt:", receipt);
    }
    initData();
  };

  const removeOwner = async (index: bigint, owner: string) => {
    console.log("🚀 ~ removeOwner ~ owner:", owner);
    console.log("🚀 ~ removeOwner ~ index:", index);
    if (!smartAccount) {
      return;
    }

    const data = await smartAccount.getRemoveOwnerCalldata(
      BigInt(index),
      getAddress(owner)
    );
    console.log("🚀 ~ removeOwner ~ data:", data);
    if (signerType === SignerType.EXTERNAL) {
      const hash = await walletClient?.sendTransaction({
        to: smartAccount.getSmartAddress(),
        data: data.callData,
      });
      if (!hash) {
        console.log("🚀 ~ removeOwner ~ hash:", hash);
        return;
      }
      console.log("🚀 ~ removeOwner ~ hash:", hash);
      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: hash,
      });
      console.log("🚀 ~ removeOwner ~ receipt:", receipt);
    }
    if (signerType === SignerType.MPC) {
      const receipt = await smartAccount.executeTransactionWithCallData(
        data,
        isSimulate
      );
      console.log("🚀 ~ addOwner ~ receipt:", receipt);
    }

    initData();
  };

  const onTransferERC20 = async () => {
    if(!smartAccount) { 
      return;
    }
    const data = await smartAccount?.getTransferERC20Calldata({
      to: DEFAULT_TO_ADDRESS,
      amount: "0.05",
      token: {
        address: USDT_ADDRESS,
        decimals: 18,
      }
    });
    const receipt = await smartAccount?.executeTransactionWithCallData(data, isSimulate);
    console.log("🚀 ~ onTransferERC20 ~ receipt:", receipt)
  };

  const onTransferERC721 = async () => {
    if(!smartAccount) { 
      return;
    }
    const TOKEN_ID = "0";
    const GIRL_COLLECTION_ADDRESS = "0xf2b7C765EE2976eF41B78aF2B6552d1C535B3cfA";
    const data = await smartAccount?.getRequestHandleCalldata({
      to: DEFAULT_TO_ADDRESS,
      tokenId: TOKEN_ID,
      token: {
        address: GIRL_COLLECTION_ADDRESS,
        // decimals: 0,
      }
    });
    const receipt = await smartAccount?.executeTransactionWithCallData(data, isSimulate);
    console.log("🚀 ~ onTransferERC20 ~ receipt:", receipt)
  };

  const onRequestHandle = async () => {
    if(!smartAccount) { 
      return;
    }

    const data = await smartAccount?.getRequestHandleCalldata(
      {
        value: "test",
        type: NFTType.ENFT,
        entity: NFTEntity.USERNAME,
      },
      {
        // headers: {
        //   Authorization: window?.localStorage?.getItem(store_key),
        // },
      },
    ); 
    const receipt = await smartAccount?.executeTransactionWithCallData(data, isSimulate);
    console.log("🚀 ~ onRequestHandle ~ receipt:", receipt)
    
  };

  return (
    <div className="p-5">
      <div className="w-full">
        <LoginForm />
      </div>
      <div className="mb-5 bg-white border border-gray-300 shadow-md p-5 rounded">
        <h2 className="text-2xl font-bold mb-3">Smart Account Address</h2>
        {smartAccount ? <p>{smartAddress}</p> : <p>Loading...</p>}
        <ConnectButton />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Signer Type
          </label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={signerType}
            onChange={(e) => setSignerType(e.target.value as SignerType)}
          >
            <option value={SignerType.MPC}>MPC</option>
            <option value={SignerType.EXTERNAL}>External</option>
          </select>
        </div>
        <div>
          <div className="mt-2">
            <button
              className={`p-2 rounded ${
                isSimulate ? "bg-red-500" : "bg-green-500"
              } text-white`}
              onClick={() => setIsSimulate(!isSimulate)}
            >
              {isSimulate ? "Disable Simulate" : "Enable Simulate"}
            </button>
          </div>
        </div>
      </div>
      <div className="mb-5 bg-white border border-gray-300 shadow-md p-5 rounded">
        {txId && (
          <div className="mt-4">
            <a
              href={`https://sepolia.arbiscan.io/tx/${txId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
             https://sepolia.arbiscan.io/tx/${txId}
            </a>
          </div>
        )}
      </div>
      <div className="mb-5 bg-white border border-gray-300 shadow-md p-5 rounded">
        <h2 className="text-2xl font-bold mb-3">Smart Account Owners</h2>
        {owners.length > 0 ? (
          <ul>
            {owners.map((owner, index) => (
              <li key={owner.index} className="justify-between items-center">
                <span>{owner.owner}</span>
                <button
                  className="ml-8 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  onClick={() => removeOwner(owner.index, owner.owner)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter new owner address"
            className="border border-gray-300 p-2 rounded mr-2"
            onChange={(e) => {
              setNewOwnerAddress(e.target.value as Address);
            }}
          />
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            onClick={addOwner}
          >
            Add Owner
          </button>
        </div>
        <div className="mt-4">
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            onClick={keepOwners}
          >
            Keep Only Owners
          </button>
        </div>
      </div>
      <div className="mb-5 bg-white border border-gray-300 shadow-md p-5 rounded">
        <h2 className="text-2xl font-bold mb-3">Token Card</h2>
        <button
          onClick={onTransferERC20}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-4"
        >
          Transfer ERC20
        </button>
        <button
          onClick={onTransferERC721}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-4"
        >
          Transfer ERC721
        </button>
      </div>
      <div className="bg-white border border-gray-300 shadow-md p-5 rounded">
        <h2 className="text-2xl font-bold mb-3">Marketplace Card</h2>
        {/* Marketplace content will go here */}
      </div>
      <div className="bg-white border border-gray-300 shadow-md p-5 rounded">
        <h2 className="text-2xl font-bold mb-3">Handle Controller Card</h2>
        {/* Marketplace content will go here */}
        <button
          onClick={onRequestHandle}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-4"
        >
          Request Handle
        </button>
      </div>
    </div>
  );
};

export default CoinbasePage;
