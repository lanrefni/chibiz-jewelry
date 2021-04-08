import axios from "axios"
import { toast } from "react-toastify";
import userService from "../services/userService"

axios.defaults.headers.common['x-auth-token'] = userService.getJwt();

axios.interceptors.response.use(null, err => {
    if (err.response && err.response > 403) {
        toast.error("An unexpected error occurred")
    }
    return Promise.reject(err)
})
const services = {
    get: axios.get,
    put: axios.put,
    patch: axios.patch,
    post: axios.post,
    delete: axios.delete,
}
export default services;
