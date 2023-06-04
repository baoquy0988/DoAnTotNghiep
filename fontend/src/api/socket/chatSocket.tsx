import ChatInfo from "src/models/Chat"
import socket from "src/models/socket"

const ChatSocket = {
    send(content: string) {
        return new Promise(async (resolve) => {
            await socket.emit('send_messenger', content)
            resolve(true)
        })
    },
    //Lấy lịch sử chat trước đó
    history() {
        return new Promise<ChatInfo[]>(async (resolve) => {
            socket.emit('history_chat', (response) => {
                if (response) return resolve(response)
                return resolve([])
            })
        })
    }
}
export default ChatSocket