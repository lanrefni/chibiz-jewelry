import http from "./http";
import { apiUrl } from "../config.json";
import jwtDecode from "jwt-decode"

const tokenKey = "token";

export function getUserInfo() {
    return http.get(`${apiUrl}/users/me`).then(resp => resp.data)
}
export function getUserInfoWithPass() {
    return http.get(`${apiUrl}/users/accMe`).then(resp => resp.data)
}

export function updateOneUser(user) {
    const userId = user._id
    return http.put(`${apiUrl}/users/${userId}`, user)
}

export function getJwt() {
    return localStorage.getItem(tokenKey)
}

export function logOut() {
    localStorage.removeItem(tokenKey)
}

export function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);
        return jwtDecode(jwt);
    }
    catch {
        return null;
    }
}
export async function login(email, password) {
    const { data } = await http.post(`${apiUrl}/auth`, { email, password });
    localStorage.setItem(tokenKey, data.token);
    const EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7;
    localStorage.setItem('expireTime', JSON.stringify({ time: new Date() }));
    setTimeout(function () {
        localStorage.removeItem('token');
    }, EXPIRE_TIME);
}

export async function passChange(_id, password, newPassword) {
    return await http.patch(`${apiUrl}/users/changePass`, { _id, password, newPassword });
}
const service = {
    getCurrentUser,
    login,
    logOut,
    getJwt,
    getUserInfo,
    updateOneUser,
    getUserInfoWithPass,
    passChange,

};

export default service;