import socket from "src/models/socket"

const loginSocket = {
    login(token: string) {
        return new Promise((resolve, reject) => {
            socket.emit('login', token, (res) => {
                if (res) return resolve(true)
                return reject(false)
            })
        })

    }
}
export default loginSocket