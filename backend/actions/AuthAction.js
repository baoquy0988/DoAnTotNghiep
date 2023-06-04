const md5 = require("md5");
const db = require("../db");
const jwt = require("jsonwebtoken");
const checkToken = require("./checkToken");
const Email = require("./SendMail");

module.exports = {
  register: (res) => {
    return new Promise((resolve, reject) => {
      try {
        username = res.user_name;
        password = res.password;
        email = res.email;
        _name = res.name;
        //Kiểm tra sự tồn tại của dữ liệu nhập vào
        if (
          username === undefined ||
          password === undefined ||
          email === undefined ||
          _name === undefined
        )
          return resolve(false);
        //kiểm tra xem thử user đã tồn tại hay chưa
        const sql = "SELECT * FROM account WHERE username = ? LIMIT 1";
        db.query(sql, [username], function (err, reponse) {
          if (err) return reject(false);

          reponse = reponse[0];
          //tên tài khoản tồn tại
          if (reponse !== undefined) return resolve({ user_name: false });

          //Username chưa tồn tại thì thêm vào sql
          const sql =
            "INSERT INTO account (username, password, email, name) VALUES (?, ?, ?, ?)";
          db.query(
            sql,
            [username, md5(password), email, _name],
            function (err, res) {
              if (err) return reject(false);
              user_id = res.insertId;
              const sql = "INSERT INTO private (user_id) VALUES (?)";
              //Đăng ký tài khoản thành công
              db.query(sql, [user_id], (err) => {
                if (err) return reject(false);
                return resolve(true);
              });
            }
          );
        });
      } catch (error) {
        return resolve(false);
      }
    });
  },
  login: (data) => {
    return new Promise((resolve) => {
      try {
        const ip = "127.0.0.1";
        username = data.user_name;
        password = md5(data.password);

        const sql =
          "SELECT * FROM account WHERE username = ? AND password = ? LIMIT 1";
        db.query(sql, [username, password], (err, reponse) => {
          if (err) throw err;

          reponse = reponse[0];
          if (reponse === undefined) return resolve({ account: false });
          info = {
            id: reponse.id,
            name: reponse.name,
            email: reponse.email,
            image: reponse.image,
            description: reponse.description,
            status: reponse.status === 1,
          };

          data = {
            user_id: reponse.id,
            name: reponse.name,
            image: reponse.image,
            status: reponse.status === 1,
            level: reponse.level === 1,
          };

          token = jwt.sign({ data: data, iat: Date.now() }, "shhhhh");
          //Lưu token vào sql
          const sql = "INSERT INTO token (value, ip, user_id) VALUES (?, ?, ?)";
          db.query(sql, [token, ip, reponse.id], function (err) {
            if (err) return resolve(false);
            info.token = token;
            return resolve({
              data: info,
              token: data,
            });
          });
        });
      } catch (error) {
        return resolve(false);
      }
    });
  },
  token: (_token) => {
    return new Promise(async (resolve, reject) => {
      try {
        //Nếu người dùng không truyền vào token - trả về true = chưa đăng nhập
        if (!_token) return resolve();

        token_decode = await checkToken.checkToken(_token);
        //Token sai hoặc hết hạn

        if (!token_decode.data) return resolve();
        info = token_decode.data;
        user_id = token_decode.data.user_id;

        const sql = "SELECT * FROM account WHERE id = ? LIMIT 1";
        db.query(sql, [user_id], (err, reponse) => {
          if (err) return reject(err);

          reponse = reponse[0];
          //Lấy danh sách bạn bè

          const sql = "SELECT * FROM friend WHERE user_id = ? OR user_id_2 = ?";
          db.query(sql, [user_id, user_id], (err, res) => {
            if (err) return reject(err);
            friends = [];
            invitation = [];
            accept = [];
            //Kiểm tra user_id hay user_id_2

            if (res[0]) {
              res.map((item) => {
                if (item.user_id === user_id) {
                  //Lời kết bạn chưa được người ta chấp nhận
                  if (item.status === 0) {
                    invitation.push(item.user_id_2);
                  } else friends.push(item.user_id_2);
                } else {
                  if (item.status === 0) {
                    accept.push(item.user_id);
                  } else friends.push(item.user_id);
                }
              });
            }

            //Kiểm tra nick có bị ban hay không
            const sql = "SELECT * FROM ban WHERE user_id = ?";
            db.query(sql, [user_id], (err, res) => {
              if (err) return reject(err);
              res = res[0];

              let band = false;
              let reason = undefined;
              if (res) {
                reason = res.reason;
                //Kiểm tra thời gian ban
                //Nếu band vĩnh viễn
                if (res.time === -1) band = true;
                newDateObj = new Date(res.date.getTime() + res.time * 60000);
                //Hết thời gian band
                if (newDateObj > Date.now()) band = newDateObj.getTime();
              }
              return resolve({
                data: {
                  id: user_id,
                  name: reponse.name,
                  email: reponse.email,
                  image: reponse.image,
                  token: _token,
                  status: reponse.status === 1,
                  description: reponse.description,
                  friend: friends,
                  invitation: invitation,
                  accept: accept,
                  level: reponse.level === 1,
                  band: band,
                  reason: reason,
                },
                info: info,
              });
            });
          });
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  //Thay đổi mật khẩu
  editPass: (user_id, password, new_password) => {
    return new Promise((resolve, reject) => {
      try {
        //Kiểm tra xem có đúng mật khẩu hay không
        const password_md5 = md5(password);
        const new_password_md5 = md5(new_password);

        const sql =
          "SELECT * FROM account WHERE id = ? AND password = ? LIMIT 1";
        db.query(sql, [user_id, password_md5], (err, res) => {
          if (err) return reject(err);
          res = res[0];
          if (res) {
            data = {
              user_id: res.id,
              name: res.name,
              image: res.image,
              status: res.status === 1,
              level: res.level === 1,
            };

            //Mật khẩu chuẩn bị thay đổi phải khác mật khẩu cũ
            if (res.password !== new_password_md5) {
              const sql = "UPDATE account SET password = ? WHERE id = ?";
              db.query(sql, [new_password_md5, user_id], (err, res) => {
                if (err) return reject(err);

                token = jwt.sign({ data: data, iat: Date.now() }, "shhhhh");
                //Xóa hết token trước đó
                const sql = "DELETE FROM token WHERE user_id = ?";
                db.query(sql, [user_id], (err) => {
                  if (err) return reject(err);
                  //Thêm token mới vào
                  const ip = "127.0.0.1";
                  const sql =
                    "INSERT INTO token (value, ip, user_id) VALUES (?, ?, ?)";
                  db.query(sql, [token, ip, data.user_id], (err) => {
                    if (err) return reject(err);
                    return resolve(token);
                  });
                });
              });
            } else {
              return resolve(false);
            }
          } else {
            return resolve();
          }
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  //Thay đổi email
  editMail: (user_id, pass, new_email) => {
    return new Promise((resolve, reject) => {
      try {
        password = md5(pass);
        const sql =
          "SELECT email, username FROM account WHERE id = ? AND password = ? LIMIT 1";
        db.query(sql, [user_id, password], (err, res) => {
          if (err) return reject(err);
          res = res[0];
          if (res) {
            user_name = res.username;
            email_old = res.email;
            if (email_old === new_email) {
              return resolve(1);
            }

            const sql = "SELECT * FROM token_edit_email WHERE user_id = ?";
            db.query(sql, [user_id], (err, res) => {
              if (err) return reject(err);
              res = res[0];
              if (res) {
                const sql =
                  "UPDATE account SET email = ?, status = 0 WHERE id = ?";
                db.query(sql, [new_email, user_id], (err, res) => {
                  if (err) return reject(err);
                  return resolve(2);
                });
              } else {
                token_edit_mail = jwt.sign(
                  { data: email_old, iat: Date.now() },
                  "shhhhh"
                );
                const sql =
                  "INSERT INTO token_edit_email (value, user_id) VALUES (?, ?)";
                db.query(sql, [token_edit_mail, user_id], async (err) => {
                  if (err) return reject(err);
                  url2 = "http://localhost:3000/undo?token=" + token_edit_mail;
                  url =
                    "http://localhost:3000/success?token=" + token_edit_mail;

                  const date = new Date().toLocaleString();
                  if (await Email.Edit(email_old, date, user_name, url, url2)) {
                    const sql =
                      "UPDATE account SET email = ?, status = 0 WHERE id = ?";
                    db.query(sql, [new_email, user_id], (err) => {
                      if (err) return reject(err);
                      return resolve(2);
                    });
                  } else {
                    return resolve(3);
                  }
                });
              }
            });
          } else {
            return resolve(0);
          }
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  undoEmail: (token) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = "SELECT * FROM token_edit_email WHERE value = ? LIMIT 1";
        db.query(sql, [token], (err, res) => {
          if (err) return reject(err);
          if (res[0]) {
            id = res[0].id;
            token_decode = jwt.decode(token);
            date = token_decode.iat;
            time = Math.floor((Date.now() - date) / 1000 / 60);
            die = 30 * 1440;
            if (time < die) {
              _email = token_decode.data;
              user_id = res[0].user_id;
              const sql =
                "UPDATE account SET status = 1, email = ? WHERE id = ?";
              db.query(sql, [_email, user_id], (err) => {
                if (err) return reject(err);
                const sql = "DELETE FROM token_edit_email WHERE id = ?";
                db.query(sql, [id], (err) => {
                  if (err) return reject(err);
                  return resolve({
                    email: _email,
                    user_id: user_id,
                  });
                });
              });
            } else {
              return resolve();
            }
          } else {
            return resolve();
          }
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
};
