import { useCustomSnackBar } from "@/hooks";
import { AuthSession, UserProfile, WalletInfo } from "@/types";
import { getSmartAccount, signer } from "@/wallet";
import { getProfile, login } from "@/wallet/auth";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("truongthi+1@evol.vn ");
  const [password, setPassword] = useState("Bein@123");
  const [walletPassword, setWalletPassword] = useState("Bein@1234");
  const [recoverKey, setRecoverKey] = useState("123456789");
  const [loginLoading, setLoginLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [session, setSession] = useLocalStorage<AuthSession | null>(
    "session",
    null
  );
  const [walletInfo, setWalletInfo] = useLocalStorage<WalletInfo | null>(
    "wallet-info",
    null
  );

  const { handleNotification } = useCustomSnackBar();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRecoverKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecoverKey(e.target.value);
  };

  const handleWalletPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWalletPassword(e.target.value);
  };


  

  const handleLoginCore = async () => {
    try {
      const data = await login({
        email,
        password,
        device: {
          "device_id": "9247532c-0f7d-4c02-8282-4b5d00879e1d",
          "device_name": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "application": "BIC_GROUP",
          "platform": "WEB"
        },
      });
      setSession(data);

      const smartAccount = await getSmartAccount();
      signer.startSession(data.id_token);
      const wallet = await smartAccount.client.getWallet({
        headers: {
          Authorization: data.id_token,
        },
      });
      setWalletInfo(wallet as any);

      setIsLogin(true);
      handleNotification("Login success", "success");
    } catch (error: any) {
      console.error("Error logging in", error);
      setIsLogin(false);
      handleNotification(error?.response?.data?.data?.message, "error");
    }
  }
  const handleLogin = async (e: any) => {
    e.preventDefault();

    setLoginLoading(true);
    await handleLoginCore();
    setLoginLoading(false);
  };

  useEffect(() => {
    handleLoginCore();
  }, []);

  const handleLoginWallet = async () => {
    // Handle form submission logic here
    if (!session || !walletInfo) {
      handleNotification("Please login first", "error");
      return;
    }
    try {
      signer.startSession(session.id_token);
      const smartAccount = await getSmartAccount();
      const loginWallet = await smartAccount.signer.login({
        password: walletPassword,
        userId: walletInfo.userId,
      });

      handleNotification("Login wallet success", "success");
    } catch (error: any) {
      console.log("🚀 ~ handleLoginWal ~ error:", error.message);
      handleNotification("Login wallet error: " + error?.message, "error");
    }
  };

  const handleRecoverWallet = async () => {
    // Handle form submission logic here
    if (!session || !walletInfo) {
      handleNotification("Please login first", "error");
      return;
    }
    try {
      signer.startSession(session.id_token);
      await signer.setupForNewDevice({
        password: walletPassword,
        userId: walletInfo.userId,
        recoveryCode: recoverKey,
      });

      handleNotification("Login wallet success", "success");
    } catch (error: any) {
      console.log("🚀 ~ handleLoginWal ~ error:", error.message);
      handleNotification("Login wallet error: " + error?.message, "error");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="text"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Wallet Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="walletPassword"
            type="text"
            placeholder="Enter your wallet password"
            value={walletPassword}
            onChange={handleWalletPasswordChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Recover Key
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="recoverKey"
            type="text"
            placeholder="Enter your recover key"
            value={recoverKey}
            onChange={handleRecoverKeyChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleLogin}
          >
            {loginLoading ? "Loading..." : "Login"}
          </button>
          <button
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleLoginWallet}
          >
            Login Wallet
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleRecoverWallet}
          >
            Recover
          </button>

          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
