"use client";

import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";


import { AuthSession, BicSmartAccount, WalletInfo } from "@/types";
import { getSmartAccount } from "@/wallet";

import LoginForm from "@/components/LoginForm";
import { BIC_ADDRESS, ETH_WRAPPED_ADDRESS } from "@/utils";
import { useCustomSnackBar } from "@/hooks";
import { paymentService } from "@/utils/payments";
import { SimulateResponse } from "@beincom/aa-sdk";

const PaymentServicePage = () => {
  const [input0Value, setInput0Value] = useState("");
  const [networkFeeByBic, setNetworkFeeByBic] = useState<string>("0");
  const [smartAccount, setSmartAccount] = useState<BicSmartAccount>();


  const [calldata, setCalldata] = useState<string>();

  const [session] = useLocalStorage<AuthSession | null>("session", null);
  const [walletInfo] = useLocalStorage<WalletInfo | null>("wallet-info", null);

  const { handleNotification } = useCustomSnackBar();


  const handleInput0Change = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput0Value(e.target.value);
    const amount = e.target.value;
    const message = {
      msg:"This is a tip message",
      postId: "1234"
    }
    try {
      const res = await paymentService.tipForCreator({
        amount: amount,
        decimals: "18",
        token: BIC_ADDRESS,
        creator: "0xeaBcd21B75349c59a4177E10ed17FBf2955fE697",
        msg: JSON.stringify(message)
      });
      setCalldata(res.calldata);
    } catch (error) {
      console.log("🚀 ~ handleTip ~ error:", error.message)
      handleNotification( "Error in tipForCreator", "error");      
    }
  };

  const handleFetchFee = async () => {
    try {
      if (!calldata) return;
      const res = (await smartAccount?.buildAndSendUserOperation(
        { calldata: calldata },
        true
      )) as SimulateResponse["changes"];
      setNetworkFeeByBic(res[0].amount);
    } catch (error) {
      handleNotification(`fetchTransactionFee error: ${error}`, "error");
      console.log("🚀 ~ fetchTransactionFee ~ error:", error);
    }
  };

  const handleTip = async () => {
    try {
      if (!calldata) return;
      const res = (await smartAccount?.buildAndSendUserOperation(
        { calldata: calldata },
        false
      )) as SimulateResponse["changes"];
      console.log("🚀 ~ handleTip ~ res:", res)

    } catch (error) {
      handleNotification(`fetchTransactionFee error: ${error}`, "error");
      console.log("🚀 ~ fetchTransactionFee ~ error:", error);
    }
  };


  const handleGetWalletByUserId = async () => {
    try {
      if(!session) {
        return;
      }
      const res = await smartAccount?.client.getWalletByUserId("8122c6ba-ed17-4929-a76e-2b9671d34474", {
        headers: {
          Authorization: session.id_token || ""
        }
      });
      console.log("🚀 ~ handleGetWalletByUserId ~ res:", res)


    } catch (error) {
      handleNotification(`fetchTransactionFee error: ${error}`, "error");

    }
  };


  useEffect(() => {
    if (session) {
      getSmartAccount().then((account) => {
        setSmartAccount(account);
      });
    }
  }, [session]);

  return (
    <div className="bg-gray-200 p-4">
      <div className="w-full">
        <LoginForm />
      </div>
      <h1 className="text-2xl font-bold mb-4">Tip Service</h1>
      <h3 className="text-2xl font-bold mb-4">
        My account address: {walletInfo?.smartAccountAddress}
      </h3>
      <h3 className="text-2xl font-bold mb-4">
        Token tip: {BIC_ADDRESS}
      </h3>
      <h4 className="text-2xl font-bold mb-4">
        Network cost: {networkFeeByBic}
      </h4>
      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="amount0"
          type="number"
          value={input0Value}
          onChange={handleInput0Change}
          placeholder="Enter amount0"
        />
      </div>
      <div className="mb-4">
      <button
          onClick={handleGetWalletByUserId}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Get Wallet By UserId
        </button>

        <button
          onClick={handleTip}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Tip
        </button>
        <button
          onClick={handleFetchFee}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Fetch network cost
        </button>
      </div>
    </div>
  );
};

export default PaymentServicePage;
