"use client";

import { AuthSession } from "@/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { createSmartAccountController } from "@beincom/aa-coinbase";
import { getCoinbaseSmartAccount } from "@/wallet";
import { Address, getAddress, isAddress, zeroAddress } from "viem";
import { owner0, owner1 } from "@/wallet/mock-signer";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

enum SignerType {
  MPC = "mpc",
  EXTERNAL = "EXTERNAL",
}
const CoinbasePage = () => {
  const [donationAddress, setDonationAddress] = useState("");
  const [session] = useLocalStorage<AuthSession | null>("session", null);
  const [smartAccount, setSmartAccount] =
    useState<Awaited<ReturnType<typeof createSmartAccountController>>>();
  const [smartAddress, setSmartAddress] = useState<Address>();
  const [owners, setOwners] = useState<{ owner: Address; index: bigint }[]>([]);
  const [newOwnerAddress, setNewOwnerAddress] = useState<Address>(
    "0xeaBcd21B75349c59a4177E10ed17FBf2955fE697"
  );
  const [signerType, setSignerType] = useState<SignerType>(SignerType.MPC);

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const {address: currentAddress} = useAccount();

  useEffect(() => {
    if (session) {
      getCoinbaseSmartAccount().then((account) => {
        setSmartAccount(account);
      });
    }
  }, [session]);

  const handleDonationSubmit = useCallback(() => {
    console.log("Donation address submitted:", donationAddress);
    const testTransferBic = async () => {
      if (!smartAccount) {
        console.log("coinbaseSmartAccount is not initialized");
        return;
      }
      const receipt = await smartAccount.transferBic(
        "0xeaBcd21B75349c59a4177E10ed17FBf2955fE697",
        (1e1).toString()
      );
      console.log("receipt: ", receipt);
    };
    testTransferBic();
  }, [donationAddress, smartAccount]);

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


    const data = await smartAccount.getKeepOnlyOwnersCalldata([newOwner.address,owner0.address, currentAddress as Address]);
    console.log("🚀 ~ keepOwners ~ data:", data)
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
      const receipt = await smartAccount.executeTransactionWithCallData(data);
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
      const receipt = await smartAccount.executeTransactionWithCallData(data);
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
      const receipt = await smartAccount.executeTransactionWithCallData(data);
      console.log("🚀 ~ addOwner ~ receipt:", receipt);
    }

    initData();
  };

  return (
    <div className="p-5">
      {/* <div className="w-full">
        <LoginForm />
      </div> */}
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
        <h2 className="text-2xl font-bold mb-3">Donation Card</h2>
        <input
          type="text"
          value={donationAddress}
          onChange={(e) => setDonationAddress(e.target.value)}
          placeholder="Enter EVM address"
          className="border border-gray-300 p-2 rounded mr-2"
        />
        <button
          onClick={handleDonationSubmit}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
      <div className="bg-white border border-gray-300 shadow-md p-5 rounded">
        <h2 className="text-2xl font-bold mb-3">Marketplace Card</h2>
        {/* Marketplace content will go here */}
      </div>
    </div>
  );
};

export default CoinbasePage;
