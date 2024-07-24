import { useCustomSnackBar } from "@/hooks";
import { login } from "@/wallet/auth";
import React, { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("truongthi+1@evol.vn ");
  const [password, setPassword] = useState("Bein@123");
  const [recoverKey, setRecoverKey] = useState("123456789");
  const [loginLoading, setLoginLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [session, setSession] = useLocalStorage("session", {});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    setLoginLoading(true);
    try {
      const data = await login({ email, password, devices: [] });
      setSession(data);
      setIsLogin(true);
      handleNotification("Login success", "success");
    } catch (error: any) {
      console.error("Error logging in", error.response.data);
      setIsLogin(false);
      handleNotification(error.response.data.data.message, "error");
    }
    setLoginLoading(false);
  };

  return (
    <div className="flex justify-center items-center">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
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
            onClick={handleSubmit}
          >
            {loginLoading ? "Loading..." : "Login"}
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Recover
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
