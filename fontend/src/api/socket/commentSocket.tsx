import InfoComment, { Reply } from "src/models/Comment"
import socket from "src/models/socket"

interface addCommet {
    token: string
    content: string
    post_id: string
}


const commentSocket = {
    add(data: addCommet) {
        return new Promise<boolean | InfoComment>(async (resolve) => {
            await socket.emit("add_comment", data, (response) => {
                resolve(response.data)
            })
        })
    },
    get(post_id: number) {
        return new Promise<InfoComment[]>(async (resolve) => {
            await socket.emit("get_comments", post_id, (response) => {
                return resolve(response.data)

            })
        })
    },
    //phản hồi bình luận
    addReply(comment_id: number, content: string) {
        return new Promise<undefined | Reply>(async (resolve) => {
            const data = {
                "content": content,
                "comment_id": comment_id
            }
            await socket.emit('reply_comment', data, (response) => {
                resolve(response)
            })
        })
    }
}

export default commentSocket