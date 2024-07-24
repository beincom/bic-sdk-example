"use client";

import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { BicSmartAccount } from "@/types";
import { getSmartAccount } from "@/wallet";

import LoginForm from "@/components/LoginForm";

const SwapTokenUniswap = () => {
  const [input1Value, setInput1Value] = useState("");
  const [input2Value, setInput2Value] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [smartAccount, setSmartAccount] = useState<BicSmartAccount>();

  const [session] = useLocalStorage("session", {});

  const handleInput1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput1Value(event.target.value);
  };

  const handleInput2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput2Value(event.target.value);
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(event.target.value);
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
      <LoginForm />
      <h1 className="text-2xl font-bold mb-4">Swap Token Uniswap</h1>
      <input
        type="text"
        value={input1Value}
        onChange={handleInput1Change}
        className="border border-gray-300 rounded-md px-2 py-1 mb-2"
      />
      <input
        type="text"
        value={input2Value}
        onChange={handleInput2Change}
        className="border border-gray-300 rounded-md px-2 py-1 mb-2"
      />
      <select
        value={selectedToken}
        onChange={handleTokenChange}
        className="border border-gray-300 rounded-md px-2 py-1 mb-2"
      >
        <option value="">Select Token</option>
        <option value="Token1">Token 1</option>
        <option value="Token2">Token 2</option>
        <option value="Token3">Token 3</option>
      </select>
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
