import socket from "src/models/socket"
import UserCpanel from "src/models/UserCpanel"
import { CryptoOrderStatus } from 'src/models/UserCpanel'
const cpanelSocket = {
    get() {
        return new Promise<UserCpanel[]>((resolve, reject) => {
            socket.emit("get_all_user", (response) => {
                if (response) return resolve(response)
            })
        })
    },
    editUser(data: UserCpanel) {
        return new Promise((resolve, reject) => {
            socket.emit('cpanel_edit_user', data, (response) => {
                if (response === true) return resolve(true)
                if (response === false) return reject(false)
                return resolve(false)
            })
        })
    },
    //Chỉ xóa tài khoản
    delUser(id: string) {
        return new Promise((resolve, reject) => {
            socket.emit('cpanel_del_user', id, false, (response) => {
                if (response) return resolve(true)
                return reject(false)
            })
        })
    },
    //Mở khóa tài khoản
    openBand(id: string) {
        return new Promise<CryptoOrderStatus>((resolve, reject) => {
            socket.emit('cpanel_open_band', id, (response) => {
                if (response) return resolve(response)
                return reject(false)
            })
        })
    },
    // Khóa tài khoản
    bandAcc(id: string, type: string, value: number, reason: string) {
        return new Promise((resolve, reject) => {
            //Tính theo giờ
            let time = -1
            if (type === '0') time = value * 60
            //Tính theo ngày
            if (type === '1') time = value * 60 * 24
            socket.emit('cpanel_band_acc', id, time, reason, (response) => {
                console.log(response)
                if (response) return resolve(true)
                return reject(false)
            })

        })
    }
}

export default cpanelSocket