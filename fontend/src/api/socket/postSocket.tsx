import socket from "src/models/socket"
import InfoPost from 'src/models/InfoPost'
import PostDetail from "src/models/PostDetail"
import Search from "src/models/Search"

interface CreatePost {
    share: string
    name: string
    content: string
}
interface LikePost {
    post_id: number,
    token: string
}

interface EditPost {
    id: number
    title: string
    content: string
}

interface Detail {
    data: PostDetail
    navigation: boolean
}
const postSocket = {
    addPost(data: CreatePost) {
        return new Promise(async (resolve, reject) => {
            await socket.emit("add_post", data, (response) => {
                if (response) return resolve(true)
                return reject(false)
            })
        })
    },
    like(post_id: number) {
        return new Promise(async (resolve) => {
            await socket.emit("like_post", post_id, (response) => {
                resolve(response.like)
            })
        })
    },
    getNotToken(data: { name: string }) {
        return new Promise<InfoPost[]>(async (resolve) => {
            await socket.emit("get_posts", data, (response) => {
                resolve(response.data)
            })
        })
    },
    get(name: string ) {
        return new Promise<InfoPost[]>(async (resolve) => {
            await socket.emit("get_posts", name, false, (response) => {
                return resolve(response)
            })
        })
    },
    getPostFriend(name: string ) {
        return new Promise<InfoPost[]>(async (resolve) => {
            await socket.emit("get_posts", name, true, (response) => {
                return resolve(response.data)
            })
        })
    },

    getDetail(url: string[]) {
        const data = {
            'post_id': url[2],
            'post_url': url[3]
        }
        return new Promise<Detail | boolean | undefined>(async (resolve, reject) => {
            await socket.emit("get_detail_post", data.post_id, data.post_url, (response) => {
                //Không tồn tại link

                if (response) {
                    //Bạn bè
                    if (response === 1) return resolve(true)
                    //Chỉ mình tôi
                    if (response === 2) return resolve(false)
                    if (response === false) {
                        return reject(false)
                    }
        
                    return resolve(response)
                }
                else
                   return resolve(undefined)
            })
        })
    },
    //Lấy bài viết có tổng số lượng cmt + like cao nhất
    trend() {
        return new Promise<InfoPost[] | boolean>(async (resolve) => {
            await socket.emit("get_posts_trend", (response) => {
                resolve(response.data)
            })
        })

    },
    //Lưu bài viết
    save(data: { title: string, content: string }) {

        return new Promise(async (resolve) => {
            await socket.emit("save_post", data, (response) => {
                resolve(response)
            })
        })
    },
    //Đóng bài viết
    lock(id: number) {
        return new Promise<boolean>(async (resolve, reject) => {
            await socket.emit("lock_post", id, (response) => {
                if (response === true) return resolve(true)
                else return reject(true)
            })
        })
    },
    //Mở bài viết
    //Đóng bài viết
    open(id: number) {
        return new Promise<boolean>(async (resolve, reject) => {
            await socket.emit("open_post", id, (response) => {
                if (response === true) return resolve(true)
                else return reject(true)
            })
        })
    },
    //Chỉnh sửa bài viết
    edit(data: EditPost) {
        return new Promise<boolean>(async (resolve) => {
            await socket.emit('edit_post', data, (response) => {
                return resolve(response)
            })
        })
    },

    //Chỉnh sửa bài viết đã lưu
    editPostSave(data: EditPost) {
        return new Promise(async (resolve, reject) => {
            await socket.emit('edit_post_save', data, (response) => {
                if (response) return reject(false)
                return resolve(true)
            })
        })
    },
    //Chỉnh sửa phạm vi chia sẻ của bài viết
    editShare(id: number, status: string) {
        return new Promise(async (resolve, reject) => {
            await socket.emit('set_status_post', id, status, (response) => {
                if (response) return reject(false)
                return resolve(true)
            })
        })
    },
    //Xóa bài viết đã lưu (bài viết chưa đăng)
    deletePostSave(id: number) {
        return new Promise(async (resolve, reject) => {
            await socket.emit('delete_post_save', id, (response) => {
                if (!response) {
                    console.log(response)
                    return resolve(true)
                }
                else return reject(false)
            })
        })
    },
    search(text: string) {
        return new Promise<Search[]>((resolve, reject) => {
            socket.emit('search', text, (response) => {
                if (response) return resolve(response)
                // if (!response) {
                //     console.log(response)
                //     return resolve(true)
                // }
                // else return reject(false)
            })
        })
    }

}
export default postSocket