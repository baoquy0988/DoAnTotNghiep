import {axiosClient} from "./axiosClient";


const serverAPI = {
    status() {
        const url = '/status'
        return axiosClient.get(url)
    }
}
export default serverAPI