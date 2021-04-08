import http from "./http"
import { apiUrl } from "../config.json"

export function createProd(prod) {
    return http.post(`${apiUrl}/prods`, prod)
}

export function getProdsAccorToGender(prodCatSec = '', prodType, perPage, page = 0, sortBy = "", reverse = false) {
    return http.get(`${apiUrl}/prods/${prodType}/${prodCatSec}/gender/?page=${page}&sort=${sortBy}&reverse=${reverse}&perPage=${perPage}`);
}
export async function searchProds(searchQuery) {
    return await http.get(`${apiUrl}/prods/search/?q=${searchQuery}`)
}
export async function getOneProd(id) {
    return await http.get(`${apiUrl}/prods/${id}`)
}
export function updateProd(prod) {
    const prodId = prod._id;
    return http.put(`${apiUrl}/prods/${prodId}`, prod);
}
export function deleteProd(id) {
    return http.delete(`${apiUrl}/prods/${id}`)
}
export function getAllProds(perPage = 12, page = 0, sortBy = "", reverse = false) {
    return http.get(`${apiUrl}/prods/?page=${page}&sort=${sortBy}&reverse=${reverse}&perPage=${perPage}`);
}
const service = {
    createProd,
    getAllProds,
    getOneProd,
    updateProd,
    deleteProd,
    getProdsAccorToGender,
    searchProds

}
export default service

