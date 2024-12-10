import axios from "axios";
import {jwtDecode} from "jwt-decode";

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

export const login = async (payload: { email: string, password: string, device: any }) => {
    const res = await axios.post<{ data: AuthSession }>(`${authEndpoint}/v1/auth/public/login`, payload, {
        headers: {'x-version-id': '2.2.0'}
    });
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
    // fetch("https://auth.beincom.io/v1/auth/public/http/login", {
    //     "headers": {
    //       "accept": "application/json, text/plain, */*",
    //       "accept-language": "en-US,en;q=0.7",
    //       "content-type": "application/json",
    //       "priority": "u=1, i",
    //       "sec-ch-ua": "\"Brave\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
    //       "sec-ch-ua-mobile": "?0",
    //       "sec-ch-ua-platform": "\"macOS\"",
    //       "sec-fetch-dest": "empty",
    //       "sec-fetch-mode": "cors",
    //       "sec-fetch-site": "same-site",
    //       "sec-gpc": "1",
    //       "x-application": "BIC_GROUP",
    //       "x-platform": "WEB",
    //       "x-security-token": "03AFcWeA6KotU4-cct-VYDUgpZbjxmiiH6Oz49HT-FCeArANiJB_LTXZZRkr8fXC74ihnDe7t-eniTwmADryHAq3Uu55vGfQEHszxyLoIUi7tyJhgTw54vMsSLYni7mAwDmxeKhDReyIb67Y19e1mhd4_UhPIfy4nDYA-nx71lzkL8jSlw_kjTQRa_-wRmC5mmnBsumjUtEsyH_U4g72L2DAFNDogZL5-OCsCUahvvCGZOqmlVs7zeC_otnGKgd22gYFENWK7fHhTDoAko-aKGoZLQcaRHjDdwgJ_I_siDJefNNqTt0HLshDDv0_8N_oCHVTNDWWhK5YeCXDHQ3SiTvRQ5Pv-9cWhgUG59B5hvC6Zuq3gh-WbLhBtYGbW4lt7gx5oEbK9icTl4fl9H0aJY-JBZTMvyi6WQ3k4d82OD2ZSXagYWJ7RrlOZqyUuUxer2ChGXGTqdMuFNnFpFr-U5k8fRHQzVpscePYBMXupP7SLpQKU9sWFf8ewGahUX-h2_JKQ1ElFF0zL1cZspnNveUIBdFlp8JwFhYfPG8UuINoKEDXbHYNo8omeP_-esKOvPOl-KV2t653sAIi0eABCrrEmGzmaLAyBMMh_ksHlKA3EHqqNFNmKQmlg821g6kYRTdHG9UxSnYu6RmWWfhJ7cx6cz47z2ixiDOhPmCzjgVyo9oB0SyyQEx03a3aypUjn_Ch0h2IC-TUAgUfx5Q8WbZN5B4WHCGaiWrGDOua876UtrBuEk1bBB_iTlPdFiGKnxhydHsAtWxQVQ4g824OZ5OSB9uel6pQo8YtSYBMnskx35ShSUmhjjG6xwsOtZJK3IVv4aJbNSn0WMjFcgRqxaFqHqQlOQcQvKp2qgt37OatzhCtex6QDEHajT2vuBbnwMati99VB42RaooyKLGfzRFZcb0NHm8YZSIBzS6cVNnhksxvC6z9VyzmYxDaDdcnlOJFzY8ww-BMfk8m1db3ZRHdy2D36jPA7-hYGAPIVYVlk-PcmoWS2uYlSMeZfbFGb6fJihvWDAaD7bRHYAeOdIZkxZ4Q2vil4lVb-GnKCuIecqxzDK03KUFGkz1X2XQuEXiCTyG9YDtNK4VvIqmYsQ6G23QUQaunRNQQwa9JLEBqvjFfeJorRIYFSSmUFQDjWP_vn3Xq9UJO5oGkshvIzqdgrTKEKOgY_BtZisULiezShOO3dWf-zVHo4jnlEaJhrDCSMX0lfbCv_gu0LuQGWwssMLefspIe2LYyDFgFKOaV2YpyKevsXL7V_1M5I2NCK-Nr0jXu6neyLAJryeI5zFI-WDTQD_gwJmS-P45b7ZAALD-IT9SJvY3ofrxmlPbRxLlWi31Zx_E8D3aeH73GZLquIa9AclNJB5HmOqEKCewOjDhX7RJ9I7G1QJLel8Ty0FnD_fjLbGe1WC6P4HkP8i9R3BCChLC444-dya1QuGGf6FOlQwf5f8jBO6UnRbTcc6PlTDbuhmsDfTPOG8V6llibfFQVBcWIS9WcugTT8kO5OWJX3vJBB9lr70-rrPt-SstVHu7zij5zDuN3CGuaDW5gLxlgR5zQ82JFCm7n09xr4b7tZmnrulQeoPuRPDgCKKqB2L2CO7MCI4p8vrsMBKfVAHp5cofUPtV7PDwV7lk8lEMBTKu9-M_x19Y-5F90rHR45auGYPallF79LB0DJarh9D49SeMmaO41nu8DHOAHUjRCUbahEZw_62JJjlFJsdwLhf3sbBQUOYadbyr83XQiZZ0Pq7HR6etXZC2DqhwEBHaG5mi4XO4kIIhVYGWObc69QbRm2sWYSU41jQ6zaRPUPG2SBywvYfP3qBaIFE_V6ucmQwM1asq7xYX6UJjzEakSGDKfeOx7o75zxvxEZjs-Fi_P90XvND6_xgbEQKYty5Pq_oOuA7uwbRP6F7m5dA-auA5N33GZqt",
    //       "x-version-id": "2.3.0"
    //     },
    //     "referrer": "https://group.beincom.io/",
    //     "referrerPolicy": "strict-origin-when-cross-origin",
    //     "body": "{\"device\":{\"device_id\":\"9247532c-0f7d-4c02-8282-4b5d00879e1d\",\"device_name\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36\",\"application\":\"BIC_GROUP\",\"platform\":\"WEB\"},\"email\":\"truongthi+1@evol.vn\",\"password\":\"Bein@123\"}",
    //     "method": "POST",
    //     "mode": "cors",
    //     "credentials": "include"
    //   });

    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const single = axios.create({
        headers: {
            'Authorization': session?.id_token,
            'user': JSON.stringify(jwtDecode(session?.id_token)),
            'x-version-id': '2.3.0',
        },
    });
    return single;
}
