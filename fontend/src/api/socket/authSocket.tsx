import socket from "src/models/socket"
import { Register, CheckRegister, Login, CheckLogin, CheckLoginToken } from 'src/models/Auth'


const AuthSocket = {
    //Lấy thông tin của bản thân
    register(data: Register) {
        return new Promise<CheckRegister>(async (resolve) => {
            await socket.emit('register_account', data, (response) => {
                resolve({
                    captcha: response.captcha,
                    server: response.server,
                    user_name: response.user_name
                })
            })
        })
    },
    login(data: Login) {
        return new Promise<CheckLogin>(async (resolve) => {
            await socket.emit('login_account', data, (response) => {
                resolve({
                    captcha: response.captcha,
                    server: response.server,
                    account: response.account,
                    data: response.data
                })
            })
        })
    },
    token(token: string) {
        return new Promise<CheckLoginToken>(async (resolve) => {
            await socket.emit('login_account_token', token, (response) => {
                resolve({
                    token: response.token,
                    server: response.server,
                    data: response.data
                })
            })
        })
    },
    //Xác thực tài khoản
    confirm(token: string) {
        return new Promise<boolean>(async (resolve, reject) => {
            await socket.emit('confirm_email', token, (response) => {
                if (response) return resolve(true)
                return reject(false)
            })
        })
    },
    //Gửi email xác thực
    request() {
        return new Promise<number>((resolve, reject) => {
            socket.emit('request_mail', (response) => {
                if (response === true) return resolve(-1)
                if (response === false) reject(false)
                return resolve(response)
            })
        })
    },
    //Thay đổi mật khẩu
    editPass(pass: string, newPass: string) {
        return new Promise<boolean>((resolve, reject) => {
            socket.emit('edit_pass', pass, newPass, (response) => {

                if (response === false) {
                    return resolve(false)
                }
                if (response === null)
                    return reject()

                //Thay đổi token ở local
                localStorage.setItem('token', response)
                return resolve(true)
            })
        })
    },
    //Thay đổi email
    editEmail(pass: string, email: string) {
        return new Promise<number>((resolve, reject) => {
            socket.emit('edit_mail', pass, email, (response) => {
                if (response === 3) return reject(3)
                return resolve(response)
            })
        })
    },
    //Hoàn tác email cho tài khoản
    undoEmail(token: string) {
        return new Promise<string>((resolve, reject) => {
            socket.emit('undo_mail', token, (response) => {
                if (response)
                    return resolve(response)
                return reject("")
            })
        })
    },
}
export default AuthSocket


