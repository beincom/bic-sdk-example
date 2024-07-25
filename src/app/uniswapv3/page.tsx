"use client";

import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { UniswapHelper, IPoolHelper, PoolHelper } from "@beincom/dex";

import { BicSmartAccount, WalletInfo } from "@/types";
import { getSmartAccount } from "@/wallet";

import LoginForm from "@/components/LoginForm";
import { BIC_ADDRESS, FUSDT_ADDRESS } from "@/utils";
import { SimulateResponse } from "@beincom/aa-sdk";
import { useCustomSnackBar } from "@/hooks";

const SwapTokenUniswap = () => {
  const [input1Value, setInput0Value] = useState("");
  const [input2Value, setInput1Value] = useState("");
  const [selectedToken0, setSelectedToken0] = useState(FUSDT_ADDRESS);
  const [selectedToken1, setSelectedToken1] = useState(BIC_ADDRESS);
  const [smartAccount, setSmartAccount] = useState<BicSmartAccount>();
  const [selectedPool, setSelectedPool] = useState<IPoolHelper>();
  const [selectedPoolAddress, setSelectedPoolAddress] = useState<string>();
  const [priceImpact, setPriceImpact] = useState<string>();
  const [minimumAmountOut, setMinimumAmountOut] = useState<string>();
  const [maximumAmountIn, setMaximumAmountIn] = useState<string>();
  const [networkFeeByBic, setNetworkFeeByBic] = useState<string>("0");
  const [calldata, setCalldata] = useState<string>();
  const [slippage] = useState((5e2).toString());
  const [swapLoading, setSwapLoading] = useState(false);

  const [session] = useLocalStorage("session", {});
  const [walletInfo] = useLocalStorage<WalletInfo | null>("wallet-info", null);

  const { handleNotification } = useCustomSnackBar();

  const handleInput0Change = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (Number(event.target.value) < 0) {
      return;
    }
    setInput0Value(event.target.value);

    if (!selectedPool) {
      return;
    }
    const exact = await selectedPool.swapExactAmountIn(
      {
        amount: event.target.value,
        token: selectedPool.token0(),
      },
      {
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        recipient: walletInfo?.smartAccountAddress || "",
        slippage,
      }
    );

    setInput1Value(exact.amountOut);
    setPriceImpact(exact.priceImpact);
    setMinimumAmountOut(exact.amountOutMin);
    setCalldata(exact.calldata);
  };

  const handleInput1Change = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (Number(event.target.value) < 0) {
      return;
    }
    setInput1Value(event.target.value);

    if (!selectedPool) {
      return;
    }
    const exact = await selectedPool.swapExactAmountOut(
      {
        amount: event.target.value,
        token: selectedPool.token1(),
      },
      {
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        recipient: walletInfo?.smartAccountAddress || "",
        slippage,
      }
    );

    setInput0Value(exact.amountInMax);
    setPriceImpact(exact.priceImpact);
    setMaximumAmountIn(exact.amountInMax);
    setCalldata(exact.calldata);
  };

  const handleToken0Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedToken1 === event.target.value) {
      return;
    }
    setSelectedToken0(event.target.value);
  };

  const handleToken1Change = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (selectedToken0 === event.target.value) {
      return;
    }

    setSelectedToken1(event.target.value);
  };

  const fetchTransactionFee = async () => {
    try {
      if (!calldata) return;
      const res = (await smartAccount?.buildAndSendUserOperation(
        { calldata: calldata },
        true
      )) as SimulateResponse["changes"];
      console.log("🚀 ~ SwapTokenUniswap ~ res:", res);
      setNetworkFeeByBic(res[0].amount);
    } catch (error) {
      console.log("🚀 ~ fetchTransactionFee ~ error:", error);
    }
  };

  const handleSwap = async () => {
    try {
      if (!calldata) {
        handleNotification(`calldata empty`, "success");
        return;
      }
      const res = await smartAccount?.buildAndSendUserOperation(
        { calldata: calldata },
        false
      );
      console.log("🚀 ~ handleSwap ~ res:", res);
      handleNotification(`Swap success: ${res}`, "success");
      setCalldata("");
      setNetworkFeeByBic("0");
    } catch (error) {}
  };

  useEffect(() => {
    if (session) {
      getSmartAccount().then((account) => {
        setSmartAccount(account);
      });
    }
  }, [session]);

  const fetchPool = async () => {
    const uniswap = new UniswapHelper({
      factoryAddress: process.env.NEXT_PUBLIC_UNISWAP_FACTORY_ADDRESS as string,
      providerUrl:
        "https://arbitrum-sepolia.rpc.thirdweb.com/e1f8d427e28ebc5bb4e5ab5c38e8d665",
    });

    const poolAddress = await uniswap.computePoolAddress(
      selectedToken0,
      selectedToken1
    );
    const pool = await uniswap.constructPool(poolAddress, true);
    const poolHelper = new PoolHelper(pool);

    setSelectedPoolAddress(poolAddress);
    setSelectedPool(poolHelper);
  };

  useEffect(() => {
    fetchPool();
  }, [selectedToken0, selectedToken1]);

  useEffect(() => {
    fetchTransactionFee();
  }, [calldata]);

  return (
    <div className="bg-gray-200 p-4">
      <div className="w-full">
        <LoginForm />
      </div>
      <h1 className="text-2xl font-bold mb-4">Swap Token Uniswap</h1>
      <h3 className="text-2xl font-bold mb-4">
        Selected pool: {selectedPoolAddress}
      </h3>
      <div>
        <p className="mb-4">Default Slippage: {slippage}%</p>
        <p className="mb-4">
          Mid price token0/token1: {selectedPool?.token0Price()}
        </p>
        <p className="mb-4">
          Mid price token1/token0: {selectedPool?.token1Price()}
        </p>
        <p className="mb-4">Price impact: {priceImpact}%</p>
        <p className="mb-4">Minimum amount out receive: {minimumAmountOut}</p>
        <p className="mb-4">Maximum amount in to pay: {maximumAmountIn}</p>
        <p className="mb-4">Network cost: {networkFeeByBic} BIC</p>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Sell
        </label>
        <div>
          <select
            value={selectedToken0}
            onChange={handleToken0Change}
            className="border border-gray-300 rounded-md px-2 py-1 mb-2"
          >
            <option value={FUSDT_ADDRESS}>FUST</option>
            <option value={BIC_ADDRESS}>BIC</option>
          </select>
          <input
            className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amount0"
            type="number"
            value={input1Value}
            onChange={handleInput0Change}
            placeholder="Enter amount0"
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Buy
        </label>
        <div>
          <select
            value={selectedToken1}
            onChange={handleToken1Change}
            className="border border-gray-300 rounded-md px-2 py-1 mb-2"
          >
            <option value={FUSDT_ADDRESS}>FUST</option>
            <option value={BIC_ADDRESS}>BIC</option>
          </select>
          <input
            className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amount1"
            type="number"
            value={input2Value}
            onChange={handleInput1Change}
            placeholder="Enter amount1"
          />
        </div>
      </div>

      <button
        onClick={handleSwap}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {swapLoading ? "Loading" : "Swap"}
      </button>
    </div>
  );
};

export default SwapTokenUniswap;
