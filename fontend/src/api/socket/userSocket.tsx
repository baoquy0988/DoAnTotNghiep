import socket from "src/models/socket"
import Info from 'src/models/Info'
import Profile from "src/models/Profile"
import SettingsUser from "src/models/SettingsUser"
import InfoFriend from "src/models/Friend"

interface Data {
    list: InfoFriend[]
    req: InfoFriend[]
}

const userSocket = {
    //Lấy thông tin của bản thân
    profile(token: string) {
        return new Promise<Info>((resolve) => {
            socket.emit('get_profile', token, (response) => {
                return resolve({
                    "statistical": response.statistical,
                    "posts": response.posts,
                    "postsSave": response.posts_save,
                    "sum_like": response.n_like,
                    "sum_comment": response.n_comment
                })
            })
        })
    },
    //Lấy profile của người khác
    otherProfile(id: string) {
        return new Promise<Profile>((resolve) => {
            socket.emit('get_other_profile', id, (response) => {
                return resolve({
                    "info": response.info,
                    "post": response.posts
                })
            })
        })
    },
    //Gửi lời mời kết bạn
    sendAddFriend(id: number) {
        return new Promise((resolve, reject) => {
            socket.emit('add_friend', id, (response) => {
                if (response)
                    return resolve('')
                else
                    return reject('')
            })
        })
    },
    //Chấp nhận kết bạn
    acceptAddFriend(id: number) {
        return new Promise((resolve, reject) => {
            socket.emit('accept_add_friend', id, (response) => {
                if (response)
                    return resolve('')
                else
                    return reject('')
            })
        })
    },
    //Hoàn tác lời mời kết bạn
    undoAddFriend(id: number) {
        return new Promise((resolve, reject) => {
            socket.emit('undo_add_friend', id, (response) => {
                if (response)
                    return resolve('')
                else
                    return reject('')
            })
        })
    },
    //Xóa bạn bè
    removeFriend(id: number) {
        return new Promise((resolve, reject) => {
            socket.emit('remove_friend', id, (response) => {
                if (response)
                    return resolve('')
                else
                    return reject('')
            })
        })
    },

    //Ẩn - hiện danh sách bài viết trong trang cá nhân
    privateShowPost(check: boolean) {
        return new Promise<void>((resolve, reject) => {
            socket.emit('private_show_posts', check, (response) => {
                if (response) return resolve()
                return reject()

            })
        })
    },
    //Lấy setting của tài khoản
    getSettingsUser() {
        return new Promise<SettingsUser>((resolve, reject) => {
            socket.emit('get_settings_user', (response) => {
                if (response) return resolve(response)
                return reject(false)
            })
        })
    },
    getFriend() {
        return new Promise<Data>((resolve, reject) => {
            socket.emit('get_all_friend', (response) => {
                if (response) {
                    return resolve({
                        list: response.data,
                        req: response.req
                    })
                }
                // return reject([])
            })
        })
    },
}
export default userSocket