import axios from "axios";

import { AuthSession } from "@/types";

const endpoint = process.env.NEXT_PUBLIC_BIC_ENDPOINT as string;

export const getSession = (): AuthSession => {
    return JSON.parse(localStorage.getItem("session") as string);
}

export const getToken = (): string => {
    return JSON.parse(localStorage.getItem("session") as string).id_token;
}

export const login = async (payload: { email: string, password: string, devices: any }) => {
    const res = await axios.post<{data: AuthSession}>(`${endpoint}/v1/auth/public/login`, payload);
    return res.data.data;
}

