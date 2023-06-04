const express = require('express')
const app = express()
http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const captcha_v2 = require('./actions/CaptchaGGv2')

const post = require('./actions/PostAction')

const comment = require('./actions/CommentAction')

const mail = require('./actions/ServiceAction')

const user = require('./actions/UserAction')

const auth = require('./actions/AuthAction')

const ser = require('./actions/ServerAction')

const chat = require('./actions/ChatAction')

const cpanel = require('./actions/CpanelAction')

const moment = require('moment')
const db = require('./db')
app.use(cors());

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

global.__basedir = __dirname;
global._io = io;

app.get('/status', ser.status)

sockets = []
chats = []

posts_public = {}

async function getPostsPublic() {
    posts_public = await post.getPostPublic()
}
async function getHistoryChat() {
    chats = await chat.get()
}

getHistoryChat()
getPostsPublic()

history_req = {}


const chatRoom = 'chat_room_15082000'
io.on('connection', (socket) => {

    console.log(`User connected ${socket.id}`)

    socket.on('add_post', (data, callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = post.add(data, user_id, socket.data.name, socket.data.image)

                action.then((res) => {

                    if (data.share !== 2) {
                        socket.broadcast.emit(('receive_add_post'), res)
                    }

                    callback(true)
                }).catch((err) => {
                    console.log(err)
                    callback(false)
                })
            }
        } catch (error) {
            console.log(error)
            callback(false)
        }
    })

    socket.on('search', (text, callback) => {
        try {
            user_id = socket.data.user_id
            post.search(text, user_id).then((res) => {
                callback(res)
            }).catch((err) => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('like_post', (post_id, callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = post.like(post_id, user_id)
                action.then((res) => {
                    socket.to(res.user_id).emit('notifications_like_your_post', {
                        title: res.title_post,
                        url: res.url_post,
                        url_user: '/profile?id=' + user_id,
                        user_name: socket.data.name,
                        image_user: socket.data.image,
                        like: res.like,
                        time: res.time,
                        user_id: user_id
                    })

                    callback({
                        "like": res.like
                    })

                }).catch((err) => {
                    console.log(err)
                })
            }
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('get_posts', (topic, friend, callback) => {
        try {
            user_id = socket.data.user_id

            const action = post.get(topic, user_id, friend)
            action.then((res) => {
                callback(res.data)
            }).catch((err) => {
                callback([])
                console.log(err)
            })

        } catch (error) {
            console.log(error)
        }
    })
    socket.on('save_post', async (data, callback) => {
        user_id = socket.data.user_id
        if (user_id) {
            const action = await post.save(data, user_id)

            callback(action)
        }
    })

    socket.on('edit_post', async (data, callback) => {
        user_id = socket.data.user_id
        if (user_id) {
            const status = await post.edit(data, user_id)
            callback(status)
        }
    })
    socket.on('edit_post_save', async (data, callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const status = post.editSave(data, user_id)
                status.then(() => {
                    callback()
                }).catch((err) => {
                    callback(false)
                    console.log(err)
                })
            }
        } catch (error) {
            callback(false)
            console.log(error)
        }
    })

    socket.on('set_status_post', (id, status, callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = post.statusPost(id, status, user_id)
                action.then(() => {
                    callback()
                }).then((err) => {
                    callback(false)
                    console.log(err)
                })

            }
        } catch (error) {
            callback(false)
            console.log(error)
        }
    })

    socket.on('delete_post_save', (id, callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = post.deletePostSave(id, user_id)
                action.then(callback())
                    .catch((err) => {
                        callback(false)
                        console.log(err)
                    })
            }
        } catch (error) {
            callback(false)
            console.log(error)

        }
    })

    socket.on('lock_post', async (id, callback) => {

        user_id = socket.data.user_id
        if (user_id) {
            const status = await post.lock(id, user_id)
            callback(status)
            //Gửi cho tất cả client về việc khóa post
            if (status === true) {
                const room = `receive_status_post_${id}`
                socket.broadcast.emit(room, {
                    "status": false
                })
            }
        }
    })
    //Mở bài viết
    //Khóa bài viết
    socket.on('open_post', async (id, callback) => {
        //Nếu client đã đăng nhập
        user_id = socket.data.user_id
        if (user_id) {
            const status = await post.open(id, user_id)
            callback(status)
            if (status === true) {
                const room = `receive_status_post_${id}`
                socket.broadcast.emit(room, {
                    "status": true
                })
            }
        }
    })

    //Lấy những bài viết hot - có nhiều lượt bình luận
    socket.on('get_posts_trend', async (callback) => {
        try {
            const action = await post.trend()
            if (action === false)
                callback({ 'data': [] })
            else
                callback({ "data": action })
        } catch (error) {

        }
    })

    //Lấy chi tiết bài viết
    socket.on('get_detail_post', (post_id, post_url, callback) => {
        try {
            user_id = socket.data.user_id

            const status = post.detail(post_id, post_url, user_id)
            status.then((res) => {

                if (res) callback(res)
                else callback(true)
            }).catch((err) => {
                // callback(false)
                console.log(err)
            })

        } catch (error) {
            // callback(false)
            console.log(error)
        }
        // const action = await post.detail(data)
        // if (action === false)
        //     callback(false)
        // else if (action === true)
        //     callback(true)
        // else callback(action)
    })
    //lấy comment của bài viết
    socket.on('get_comments', async (data, callback) => {
        const action = await comment.get(data)

        if (action !== false)
            callback({ "data": action.data })

    })
    //Bình luận vào bài viết
    socket.on('add_comment', async (data, callback) => {
        //Nếu client đã đăng nhập
        try {
            user_id = socket.data.user_id
            if (user_id) {

                const action = comment.add(data, user_id, socket.data.name, socket.data.image)
                //Đã thêm bình luận thành công
                action.then((res) => {
                    callback({ "data": res.data })
                    //Thông báo cho chủ bài viết 
                    socket.to(res.user_id_post).emit('notifications_comment_your_post', {
                        title_post: title_post,
                        url: url_post,
                        user_name: socket.data.name,
                        url_user: '/profile?id=' + user_id,
                        image_user: socket.data.image,
                        time: res.time
                    })

                    const room = `receive_add_comment_${res.id_post}`
                    //Thông báo cho tất cả client để cập nhật
                    socket.broadcast.emit(room, {
                        "id": res.data.id,
                        "user_id": user_id,
                        "name": socket.data.name,
                        "content": res.data.content,
                        "date": res.time,
                        "image": socket.data.image,
                        "reply": []
                    })
                }).catch((err) => {
                    console.log(err)
                })
            }
        } catch (error) {
            console.log(error)
        }
    })
    //Phản hồi bình luận
    socket.on('reply_comment', async (data, callback) => {
        //Nếu client đã đăng nhập
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = comment.addReplyComment(socket.data.name, user_id, data)

                //Thêm thành công
                action.then((res) => {
                    callback(
                        {
                            "user_id": user_id,
                            "name": socket.data.name,
                            "content": data.content,
                            "date": res.date,
                            "image": socket.data.image
                        }
                    )
                    //id comment được phản hồi
                    const response = {
                        user_name: socket.data.name,
                        url_user: '/profile?id=' + user_id,
                        url: res.url,
                        time: res.date,
                        image_user: socket.data.image,
                        content: data.content
                    }

                    //Gửi cho người dùng được rep
                    socket.to(res.user_id_comment).emit('notifications_reply_comment', response)

                    //Gửi cho người đăng bài viết
                    // socket.to(res.user_id_post).emit('notifications_comment_your_post', {
                    //     "title": title,
                    //     "url": url,
                    //     "name_comment": user_name_reply,
                    //     "time": date
                    // })
                    const room = `receive_add_reply_comment_${data.comment_id}`
                    //Gửi cho tất cả client cập nhật bình luận
                    socket.broadcast.emit(room,
                        {
                            "user_id": user_id,
                            "name": socket.data.name,
                            "content": data.content,
                            "date": res.date,
                            "image": socket.data.image
                        }
                    )
                }).catch((err) => {
                    console.log(err)
                    return callback(undefined)
                })
            }
        } catch (error) {
            console.log(error)
        }
    })

    //Gửi tin nhắn xác nhận mail
    socket.on('request_mail', (callback) => {
        //Mỗi lần gửi xác thực cách nhau 1p
        try {
            user_id = socket.data.user_id
            if (user_id) {
                //Kiểm tra xem lần gửi mail trước đó có cách 1p chưa (tránh spam)
                if (history_req.user_id) {
                    timer = parseInt((Date.now() - history_req.user_id) / 1000)
                    if (timer > 60) {
                        const action = mail.request(user_id, socket.data.name)
                        action.then((res) => {
                            if (res) {
                                callback(true)
                                history_req.user_id = Date.now()
                            } else callback(false)
                        }).catch((err) => {
                            callback(false)
                            console.log(err)
                        })
                    }
                    else callback(60 - timer)
                }
                else {
                    history_req.user_id = Date.now()
                    callback(true)
                }
            }
        } catch (error) {
            callback(false)
            console.log(error)
        }
    })
    //Lấy các thông tin của người dùng
    socket.on('get_profile', (token, callback) => {
        //Nếu client đã đăng nhập
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = user.profile(user_id)
                action.then((res) => {
                    callback(res)
                }).catch((err) => {
                    console.log(err)
                })
            }
        } catch (error) {
            console.log(error)
        }
    })
    //Lấy thông tin của người khác
    socket.on('get_other_profile', async (id, callback) => {
        //Nếu client đã đăng nhập
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = user.otherProfile(id)
                action.then((info) => {

                    if (info) {
                        const action_post = post.postsOfUser(user_id, id)
                        action_post.then((posts) => {
                            callback({
                                "info": info,
                                "posts": posts
                            })

                        }).catch((err) => {
                            console.log(err)
                        })
                    }
                    //Người dùng không tồn tại
                    else {
                        callback({
                            "info": undefined,
                            "posts": undefined
                        })
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }

        } catch (error) {
            console.log(error)
        }
    })

    //Lấy friend của tài khoản - yêu cầu kết bạn
    socket.on('get_all_friend', (callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = user.getFriend(user_id)
                action.then((res) => {
                    callback(res)
                }).catch((err) => {
                    console.log(err)
                })
            }
        } catch (error) {
            console.log(error)
        }
    })
    //Lấy tất cả yêu cầu kết bạn
    socket.on('get_all_request_add_friend', (callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                user.getRequestFriend(user_id).then((res) => {
                    callback(res)
                }).catch((err) => {
                    console.log(err)
                })
            }
        } catch (error) {
            console.log(error)
        }
    })

    //Gửi lời mời kết bạn
    socket.on('add_friend', (id, callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = user.sendAddFriend(id, user_id)
                action.then((res) => {
                    if (res) {
                        callback(true)
                        //Thay đổi component
                        socket.to(id).emit('receive_add_friend', user_id)
                        //Thông báo

                        const data = {
                            user_id: socket.data.user_id,
                            user_name: socket.data.name,
                            image_user: socket.data.image,
                            url_user: '/profile?id=' + socket.data.user_id,
                            time: (Date.now())
                        }
                        socket.to(id).emit('receive_noti_add_friend', data)

                    }
                    else
                        callback(false)
                }).catch((err) => {
                    callback(false)
                    console.log(err)
                })
            }
        } catch (error) {
            callback(false)
            console.log(error)
        }
    })
    //Chấp nhận kết bạn
    socket.on('accept_add_friend', (id, callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = user.acceptAddFriend(id, user_id)
                action.then(() => {
                    callback(true)
                    socket.to(id).emit('receive_accept_add_friend', user_id)
                    //Gửi thông báo kết bạn thành công
                    const data = {
                        user_id: socket.data.user_id,
                        user_name: socket.data.name,
                        image_user: socket.data.image,
                        url_user: '/profile?id=' + socket.data.user_id,
                        time: (Date.now())
                    }

                    socket.to(id).emit('receive_noti_accept_add_friend', data)

                }).catch((err) => {
                    console.log(err)
                    callback(false)
                })
            }
        } catch (error) {
            callback(false)
            console.log(error)
        }
    })
    //Hoàn tác lời mời kết bạn
    socket.on('undo_add_friend', (id, callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = user.undoAddFriend(id, user_id)
                action.then(() => {
                    callback(true)
                    socket.to(id).emit('receive_undo_add_friend', user_id)
                }).catch((err) => {
                    console.log(err)
                    callback(false)
                })
            }
        } catch (error) {
            callback(false)
            console.log(error)
        }
    })
    //Xóa bạn bè
    socket.on('remove_friend', (id, callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = user.removeFriend(id, user_id)
                action.then(() => {
                    callback(true)
                    socket.to(id).emit('receive_remove_friend', user_id)
                }).catch((err) => {
                    callback(false)
                    console.log(err)
                })
            }
        } catch (error) {
            callback(false)
            console.log(error)
        }
    })

    socket.on('captcha_v2', async (token) => {
        const action = await captcha_v2.validateHuman(token)
    })

    //Đăng kí tài khoản
    socket.on('register_account', async (data, callback) => {
        //Kiểm tra xác thực captcha
        try {
            const checkCaptcha = await captcha_v2.validateHuman(data.captcha)
            //Captcha sai
            if (checkCaptcha === false)
                callback({ 'captcha': false })
            else {
                const action = auth.register(data)
                action.then((res) => {
                    if (res.user_name === false)
                        callback({
                            'captcha': true,
                            'server': true,
                            'user_name': false
                        })
                    else
                        callback({
                            'captcha': true,
                            'server': true,
                            'user_name': true,
                        })
                }).catch((err) => {
                    callback(
                        {
                            'captcha': true,
                            'server': false
                        }
                    )
                    console.log(err)
                })
            }
        } catch (error) {
            console.log(error)
        }
    })

    //Xác thực tài khoản
    socket.on('confirm_email', (token, callback) => {
        try {
            const status = mail.confirm(token)
            status.then((res) => {
                if (res) {
                    callback(true)
                }
                else callback(false)
            })
        } catch (error) {
            console.log(error)
        }

    })

    //Đăng kí tài khoản
    socket.on('login_account', async (data, callback) => {
        //Kiểm tra xác thực captcha
        const checkCaptcha = await captcha_v2.validateHuman(data.captcha)
        //Captcha sai
        if (checkCaptcha === false)
            callback({ 'captcha': false })
        else {
            const action = await auth.login(data)
            //Có lỗi xảy ra
            if (action === false)
                callback(
                    {
                        'captcha': true,
                        'server': false
                    }
                )
            //Tài khoản không chính xác
            else if (action.account === false)
                callback(
                    {
                        'captcha': true,
                        'server': true,
                        'account': false
                    }
                )
            //Tài khoản chính xác
            else {
                callback(
                    {
                        'captcha': true,
                        'server': true,
                        'account': true,
                        'data': action.data
                    }
                )

                if (action.token) {

                    sockets.push({
                        "socket": socket,
                        "data": action.token,
                    })
                    user_id = action.token.user_id
                    socket.data = action.token

                    socket.join(user_id)
                    //Chỉ join phòng chat những tài khoản đã kích hoạt
                    if (action.token.status === true) {
                        socket.join(chatRoom)
                    }

                }
            }
        }
    })
    //Đăng nhập bằng token
    socket.on('login_account_token', async (_token, callback) => {
        // console.log(socket.conn.remoteAddress)
        const action = auth.token(_token)
        action.then((res) => {
            if (res) {
                callback({
                    'data': res.data
                })

                //Thêm thông tin
                if (res.info) {
                    sockets.push({
                        "socket": socket,
                        "data": res.info,
                    })
                    user_id = res.info.user_id
                    socket.data = res.info

                    socket.join(user_id)
                    //Chỉ join phòng chat những tài khoản đã kích hoạt
                    if (res.info.status === true) {
                        socket.join(chatRoom)
                    }
                }
            }
            else
                callback({
                    'token': false
                })

        }).catch((err) => {
            callback({
                'server': false
            })
        })
    })

    socket.on('history_chat', (callback) => {
        try {
            callback(chats)
        } catch (error) {
            console.log(error)
        }
    })
    //Thay đổi mật khẩu
    socket.on('edit_pass', (pass, new_pass, callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                auth.editPass(user_id, pass, new_pass).then((res) => {
                    callback(res)
                    if (res !== false && res !== undefined) {
                        //Tiến hành đăng xuất các tài khoản còn lại
                        socket.broadcast.to(user_id).emit('request_logout')
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        } catch (error) {
            console.log(error)
        }
    })
    //Thay  đổi email
    socket.on('edit_mail', (pass, email, callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                auth.editMail(user_id, pass, email).then((res) => {
                    // : trùng email
                    // 0: sai pass
                    //2: ok
                    //3: Lỗi gửi mail
                    callback(res)

                }).catch((err) => {
                    console.log(err)
                    callback()
                })
            }
        } catch (error) {
            console.log(error)
        }
    })
    //Hoàn tác việc thay đổi email
    socket.on('undo_mail', (token, callback) => {
        try {
            auth.undoEmail(token).then((res) => {
                callback(res)
                //Xóa tất cả tài khoản đang onl
                socket.broadcast.to(res.user_id).emit('request_logout')

                // console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    })


    //Chat
    socket.on('send_messenger', async (content) => {
        //Xác thực người đùng chính xác tránh trường hợp dùng api
        if (socket.rooms.has(chatRoom) === true) {
            //Gửi cho tất cả client còn lại đang trong phòng chat
            //Nếu client đã đăng nhập
            user_id = socket.data.user_id
            if (user_id) {

                message = {
                    'user_id': user_id,
                    'name': socket.data.name,
                    'image': socket.data.image,
                    'content': content,
                    'date': moment(Date.now()).format('HH:mm')
                }
                chats.push(message)

                socket.broadcast.to(chatRoom).emit('receive_messenger', message)

                //Thêm vào sql
                console.log(await chat.add(user_id, content))
            }
        }
    })
    //Lấy setting của tài khoản
    socket.on('get_settings_user', (callback) => {
        try {

            user_id = socket.data.user_id
            console.log(user_id)
            if (user_id) {
                const action = user.getSettingsUser(user_id)
                action.then((res) => {
                    // console.log(res)
                    callback(res)
                }).catch((err) => {
                    callback(undefined)
                    console.log(err)
                })
            }
        } catch (error) {
            callback(undefined)
            console.log(error)
        }
    })
    //Prive các quyền riêng tư
    //Hiển thị - ẩn danh sách bài viết trong trang cá nhân
    socket.on('private_show_posts', (check, callback) => {
        try {
            user_id = socket.data.user_id
            if (user_id) {
                const action = user.privateShowPosts(check, user_id)
                action.then(() => {
                    callback(true)
                }).catch((err) => {
                    callback(false)
                    console.log(err)
                })
            }
        } catch (error) {
            callback(false)
            console.log(error)
        }
    })

    //Quản Trị Viên
    socket.on('get_all_user', (callback) => {
        try {
            level = socket.data.level
            if (level) {
                const action = cpanel.get()
                action.then((res) => {
                    callback(res)
                }).catch((err) => {
                    console.log(err)
                })
            }
        } catch (error) {
            console.log(error)
        }
    })
    //Chirnh sửa thông tin người dùng
    socket.on('cpanel_edit_user', (data, callback) => {
        try {
            level = socket.data.level
            if (level) {
                const action = cpanel.editUser(data)
                action.then((res) => {
                    if (res)
                        callback(true)
                    else
                        callback()
                }).catch((err) => {
                    callback(false)
                    console.log(err)
                })
            }
        } catch (error) {
            callback(false)
            console.log(error)
        }
    })
    //Xóa tài khoản
    socket.on('cpanel_del_user', (user_id, del_all, callback) => {
        try {
            level = socket.data.level
            //Có quyền admin mới sử dụng chức năng này được
            if (level) {
                //xóa tất cả
                if (del_all) {

                } else {
                    cpanel.delUser(user_id).then(() => {
                        callback(true)
                    }).catch(() => {
                        callback(false)
                    })
                }
            }
        } catch (error) {
            callback(false)
            console.log(error)
        }
    })
    //Mở khóa tài khoản
    socket.on('cpanel_open_band', (user_id, callback) => {
        try {
            level = socket.data.level
            //Có quyền admin mới sử dụng chức năng này được
            if (level) {
                cpanel.openBand(user_id).then((res) => {
                    callback(res)
                    socket.broadcast.to(user_id).emit('server_open_band_account')
                }).catch((err) => {

                    console.log(err)
                    callback(undefined)
                })
            }
        } catch (error) {
            console.log(error)
        }
    })

    //Khóa tài khoản
    socket.on('cpanel_band_acc', (user_id, time, reason, callback) => {
        try {
            level = socket.data.level
            //Có quyền admin mới sử dụng chức năng này được
            if (level) {
                cpanel.bandAcc(user_id, time, reason).then(() => {
                    callback(true)
                    //Thông báo đến tài khoản bị band
                    let _reason = "Mình thích thì mình khóa thôi haha"
                    if (reason !== '') _reason = reason
                    if (time !== -1) {
                        newDateObj = new Date(Date.now() + time * 60000)
                        socket.broadcast.to(user_id).emit('server_band_account', {
                            time: newDateObj.getTime(),
                            reason: _reason
                        })
                    }
                    else socket.broadcast.to(user_id).emit('server_band_account', {
                        time: -1,
                        reason: _reason
                    })

                    // rest = Math.floor(rest)
                    //Hết thời gian band

                    // if (newDateObj > Date.now()) band = newDateObj.getTime()


                }).catch((err) => {
                    console.log(err)
                })
            }
        } catch (error) {
            console.log(error)
        }
    })
    //Client ngắt kết nối
    socket.on('disconnect', () => {
        console.log(`User disconnect ${socket.id}`)
        for (var i = sockets.length - 1; i >= 0; i--) {
            if (sockets[i].socket.id === socket.id) {
                sockets.splice(i, 1);
            }
        }
    })
})


server.listen(5000, () => 'Server is running on')