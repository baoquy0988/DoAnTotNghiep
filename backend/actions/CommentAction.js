const db = require('../db')
const jwt = require('jsonwebtoken')
var moment = require('moment')
const checkToken = require('./checkToken')

const formatDay = (date) => {

    dayNow = moment(Date.now()).format('DD-MM-YYYY')
    day = moment(date).format('DD-MM-YYYY')

    if (day === dayNow) return day = moment(date).format('HH:mm') + ' • Hôm nay'
    return moment(date).format('HH:mm • DD-MM-YYYY ')
}


const getReplyCommet = (comment_id) => {
    return new Promise(async (resolve) => {
        const sql = 'SELECT * FROM reply_comment as reply INNER JOIN account ON reply.user_id = account.id WHERE reply.comment_id = ? ORDER BY reply.date DESC'
        await db.query(sql, [comment_id], (err, reponse) => {
            reply = []
            reponse.map((value) => {
                text = {
                    'user_id': value.user_id,
                    'content': value.content,
                    'date': (value.date).getTime(),
                    'name': value.name,
                    'image': value.image
                }
                reply.push(text)

            })
            resolve(reply)
        })
    })
}

module.exports = {
    get: (post_id) => {
        return new Promise((resolve) => {
            try {
                setTimeout(() => {
                    data = []
                    const sql = 'SELECT * FROM account INNER JOIN comments ON comments.user_id = account.id WHERE comments.post_id = ?  ORDER BY comments.date DESC'
                    db.query(sql, [post_id], async (err, reponse) => {
                        if (err) throw err
                        data = []
                        const result = reponse.map(async (value) => {
                            reply = await getReplyCommet(value.id)
                            text = {

                                'id': value.id,
                                'user_id': value.user_id,
                                'name': value.name,
                                'content': value.content,
                                'date': (value.date).getTime(),
                                'image': value.image,
                                'reply': reply

                            }
                            return text
                        })

                        const results = await Promise.all(result);
                        resolve({ "data": results })
                    })
                }, 0)
            } catch (error) {
                resolve(false)
            }
        })
    },
    add: async (req, user_id, user_name, user_image) => {
        return new Promise(async (resolve, reject) => {
            try {
                post_id = req.post_id
                _content = req.content
                const sql = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)'

                db.query(sql, [post_id, user_id, _content], (err, res) => {
                    if (err) return reject()
                    id_comment = res.insertId
                    const sql = 'UPDATE posts SET n_comments = n_comments + 1 WHERE id = ?'
                    db.query(sql, [post_id], (err) => {
                        if (err) return reject()
                        const sql = 'SELECT * FROM posts WHERE id = ?'
                        db.query(sql, [post_id], (err, reponse) => {
                            if (err) return reject(false)

                            user_id_post = reponse[0].user_id
                            url_post = ('/post/' + reponse[0].id + '/' + reponse[0].url)
                            title_post = reponse[0].title

                            return resolve(
                                {
                                    "id_post": reponse[0].id,
                                    "user_id_post": reponse[0].user_id,
                                    "url_post": url_post,
                                    "title_post": title_post,
                                    "name_comment": user_name,
                                    "time": (Date.now()),
                                    "data": {
                                        'id': id_comment,
                                        'user_id': user_id,
                                        'name': user_name,
                                        'content': _content,
                                        'date': (Date.now()),
                                        'image': user_image,
                                        'reply': []
                                    }
                                }
                            )
                        })

                    })
                })
            } catch (error) {
                return reject()
            }
        })
    },
    addReplyComment: (name, user_id, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                content = data.content
                comment_id = data.comment_id
                const sql = `SELECT posts.id AS id, posts.url AS url, posts.title AS title,
                    comments.user_id AS c_user_id, posts.user_id AS p_user_id 
                    FROM comments INNER JOIN posts ON comments.post_id = posts.id WHERE comments.id = ? LIMIT 1`
                db.query(sql, [comment_id], (err, res) => {
                    if (err) return reject(err)
                    if (res[0] === undefined) return reject()
                    c_user_id = res[0].c_user_id
                    p_user_id = res[0].p_user_id
                    url = res[0].url
                    id = res[0].id
                    title = res[0].title

                    const sql = 'INSERT INTO reply_comment (user_id, comment_id, content) VALUES (?, ?, ?)'
                    db.query(sql, [user_id, comment_id, content], (err) => {
                        if (err) return reject(err)
                        return resolve({
                            "user_id_comment": c_user_id,
                            "user_id_post": p_user_id,
                            "user_name_reply": name,
                            "url": ('/post/' + id + '/' + url),
                            "date": (Date.now()),
                            'title': title
                        })
                    })

                })
            } catch (error) {
                return reject(error)
            }
        })
    }
}