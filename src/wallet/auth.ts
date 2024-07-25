import axios from "axios";

import { AuthSession, UserProfile } from "@/types";

const authEndpoint = process.env.NEXT_PUBLIC_BIC_AUTH_ENDPOINT as string;
const apiEndpoint = process.env.NEXT_PUBLIC_BIC_API_ENDPOINT as string;

export const getSession = (): AuthSession => {
    return JSON.parse(localStorage.getItem("session") as string);
}

export const getToken = (): string => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    return session?.id_token;
}

export const login = async (payload: { email: string, password: string, devices: any }) => {
    const res = await axios.post<{ data: AuthSession }>(`${authEndpoint}/v1/auth/public/login`, payload);
    return res.data.data;
}

export const getProfile = async (username: string, payload: { accessToken: string }) => {
    const res = await axios.get<{ data: UserProfile }>(`${apiEndpoint}/v1/user/users/${username}/profile?type=username`, {
        headers: {
            "Authorization": `${payload.accessToken}`
        }
    });
    return res.data.data;
}

export const AxiosSingleton = ()=>{
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const single = axios.create({
        headers: session.id_token
    });
    return single;
}
