"use client";

import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { UniswapHelper, IPoolHelper, PoolHelper } from "@beincom/dex";

import { BicSmartAccount } from "@/types";
import { getSmartAccount } from "@/wallet";

import LoginForm from "@/components/LoginForm";
import { BIC_ADDRESS, FUSDT_ADDRESS } from "@/utils";

const SwapTokenUniswap = () => {
  const [input1Value, setInput0Value] = useState("");
  const [input2Value, setInput1Value] = useState("");
  const [selectedToken0, setSelectedToken0] = useState(FUSDT_ADDRESS);
  const [selectedToken1, setSelectedToken1] = useState(BIC_ADDRESS);
  const [smartAccount, setSmartAccount] = useState<BicSmartAccount>();
  const [selectedPool, setSelectedPool] = useState<IPoolHelper>();
  const [priceImpact, setPriceImpact] = useState<string>();
  const [minimumAmountOut, setMinimumAmountOut] = useState<string>();

  const [slippage] = useState("500");

  const [session] = useLocalStorage("session", {});

  const handleInput0Change = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput0Value(event.target.value);

    if(!selectedPool) {
      return;
    }
    const exact = await selectedPool.swapExactAmountIn(event.target.value, selectedPool.token0(), slippage);
    console.log("🚀 ~ handleInput0Change ~ exact:", exact)
    setInput1Value(exact.amountOut);
    setPriceImpact(exact.priceImpact);
    setMinimumAmountOut(exact.amountOutMin);
  };

  const handleInput1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput1Value(event.target.value);
  };

  const handleToken0Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedToken1 === event.target.value) {
      return;
    }
    setSelectedToken0(event.target.value);
  };

  const handleToken1Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedToken0 === event.target.value) {
      return;
    }
    setSelectedToken1(event.target.value);
  };

  const handleSwap = async () => {
   
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

    setSelectedPool(poolHelper);
  };

  useEffect(() => {
    fetchPool();
  }, [selectedToken0, selectedToken1]);

  return (
    <div className="bg-gray-200 p-4">
      <div className="w-full">
        <LoginForm />
      </div>
      <h1 className="text-2xl font-bold mb-4">Swap Token Uniswap</h1>
      <div>
        <p className="mb-4">Default Slippage: {slippage}%</p>
        <p className="mb-4">Mid price token0/token1: {selectedPool?.token0Price()}</p>
        <p className="mb-4">Mid price token1/token0: {selectedPool?.token1Price()}</p>
        <p className="mb-4">Price impact: {priceImpact}%</p>
        <p className="mb-4">Minimum amount: {minimumAmountOut}</p>
        <p className="mb-4">Network cost: 23 BIC</p>
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
        Swap
      </button>
    </div>
  );
};

export default SwapTokenUniswap;
