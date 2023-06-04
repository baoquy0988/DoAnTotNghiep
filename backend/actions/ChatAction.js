const db = require("../db")
var moment = require('moment')
module.exports = {
    get: () => {
        return new Promise((resolve) => {
            const sql = "SELECT * FROM chat INNER JOIN account ON account.id = chat.user_id"
            db.query(sql, (err, res) => {
                if (err) return resolve([])
                data = []
                res.map((value) => {

                    text = {
                        "user_id": value.user_id,
                        "name": value.name,
                        "image": value.image,
                        "content": value.content,
                        "date": moment(value.date).format('HH:mm')
                    }
                    data.push(text)
                })
                return resolve(data)
            })
        })
    },
    add: (user_id, content) => {
        return new Promise((resolve) => {
            const sql = "INSERT INTO chat (user_id, content) VALUES (?, ?)"
            db.query(sql, [user_id, content], function (err) {
                if (err) return resolve(false)
                return resolve(true)
            })
        })
    }
}