"use client";

import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { BicSmartAccount } from "@/types";
import { getSmartAccount } from "@/wallet";

import LoginForm from "@/components/LoginForm";
import { BIC_ADDRESS, FUSDT_ADDRESS } from "@/utils";

const SwapTokenUniswap = () => {
  const [input1Value, setInput1Value] = useState("");
  const [input2Value, setInput2Value] = useState("");
  const [selectedToken0, setSelectedToken0] = useState("");
  const [selectedToken1, setSelectedToken1] = useState("");
  const [smartAccount, setSmartAccount] = useState<BicSmartAccount>();

  const [slippage] = useState(0.5);

  const [session] = useLocalStorage("session", {});

  const handleInput1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput1Value(event.target.value);
  };

  const handleInput2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput2Value(event.target.value);
  };

  const handleToken0Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken0(event.target.value);
  };

  const handleToken1Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken1(event.target.value);
  };

  const handleSwap = () => {
    // Perform swap logic here
    console.log("Swapping tokens...");
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
      <div>
        <LoginForm />
      </div>
      <h1 className="text-2xl font-bold mb-4">Swap Token Uniswap</h1>
      <div>
        <p className="mb-4">Default Slippage: {slippage}%</p>
        <p className="mb-4">Price impact: 0.99%</p>
        <p className="mb-4">Minimum amount: 12.000</p>
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
            onChange={handleInput1Change}
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
            onChange={handleInput2Change}
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
