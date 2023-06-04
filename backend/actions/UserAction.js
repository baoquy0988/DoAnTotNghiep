const db = require("../db");
const jwt = require("jsonwebtoken");
var moment = require("moment");
const checkToken = require("./checkToken");
const e = require("express");

const formatDay = (date) => {
  dayNow = moment(Date.now()).format("DD-MM-YYYY");
  day = moment(date).format("DD-MM-YYYY");

  if (day === dayNow)
    return (day = moment(date).format("HH:mm") + " • Hôm nay");
  return moment(date).format("HH:mm • DD-MM-YYYY ");
};

module.exports = {
  profile: (user_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql =
          "SELECT COUNT(*), user_id , substring(date,1,10) FROM posts WHERE user_id = ? GROUP BY user_id , substring(date,1,10)";
        db.query(sql, [user_id], (err, reponse) => {
          if (err) return reject(err);
          data = [];
          reponse.forEach((element) => {
            text = {
              date: element["substring(date,1,10)"],
              count: element["COUNT(*)"],
            };
            data.push(text);
          });

          var now = new Date();
          var duedate = new Date(now);
          duedate.setDate(duedate.getDate() + 1);

          dataDate = data;
          for (i = 0; i < 365; i++) {
            day = duedate.setDate(duedate.getDate() - 1);
            day = moment(day).format("YYYY-MM-DD");
            if (!data.find((item) => item.date === day)) {
              text = {
                date: day,
                count: 0,
              };
              dataDate.push(text);
            }
          }
          const sql = "SELECT * FROM posts WHERE user_id = ?";
          db.query(sql, [user_id], (err, reponse) => {
            if (err) return reject(err);

            dataPost = [];
            sumComment = 0;
            sumLike = 0;
            reponse.map((item) => {
              sumComment += item.n_comments;
              sumLike += item.n_like;
              text = {
                id: item.id,
                title: item.title,
                content: jwt.decode(item.content).content,
                n_comment: item.n_comments,
                n_like: item.n_like,
                date: item.date.getTime(),
                url: "/post/" + item.id + "/" + item.url,
                status: item.status === 1,
                share: item.share,
              };
              dataPost.push(text);
            });
            const sql = "SELECT * FROM posts_save WHERE user_id = ?";
            db.query(sql, [user_id], (err, reponse) => {
              if (err) return reject(err);
              dataPostSave = [];
              reponse.map((item) => {
                text = {
                  id: item.id,
                  title: item.title,
                  content: jwt.decode(item.content).content,
                  date: item.date.getTime(),
                };
                dataPostSave.push(text);
              });
              return resolve({
                posts: dataPost.reverse(),
                posts_save: dataPostSave.reverse(),
                statistical: dataDate,
                n_like: sumLike,
                n_comment: sumComment,
              });
            });
          });
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  otherProfile: (id) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = "SELECT * FROM account WHERE id = ? LIMIT 1";
        db.query(sql, [id], (err, res) => {
          if (err) return reject();
          res = res[0];

          if (res) {
            info = {
              id: res.id,
              name: res.name,
              image: res.image,
              description: res.description,
            };
            return resolve(info);
          } else {
            return resolve();
          }
        });
      } catch (error) {
        return reject();
      }
    });
  },
  sendAddFriend: (id, user_id) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = "INSERT INTO friend (user_id, user_id_2) VALUES (?, ?)";
        db.query(sql, [user_id, id], (err, res) => {
          if (err) return reject(err);

          if (res) {
            return resolve(true);
          } else return resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  acceptAddFriend: (id, user_id) => {
    return new Promise((resolve, reject) => {
      try {
        const sql =
          "UPDATE friend SET status = 1 WHERE user_id= ? AND user_id_2 = ?";
        db.query(sql, [id, user_id], (err) => {
          if (err) return reject(err);
          return resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  undoAddFriend: (id, user_id) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = "DELETE FROM friend WHERE user_id = ? AND user_id_2 = ?";
        db.query(sql, [user_id, id], (err) => {
          if (err) return reject(err);
          return resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  removeFriend: (id, user_id) => {
    return new Promise((resolve, reject) => {
      try {
        const sql =
          "DELETE FROM friend WHERE (user_id = ? AND user_id_2 = ?) OR (user_id = ? AND user_id_2 = ?)";
        db.query(sql, [id, user_id, user_id, id], (err) => {
          if (err) return reject(err);
          return resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  getSettingsUser: (user_id) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = "SELECT * FROM private WHERE user_id = ?";
        db.query(sql, [user_id], (err, res) => {
          if (err) return reject(err);
          res = res[0];
          const data = {
            p_posts: res.posts,
            p_email: res.email,
          };
          return resolve(data);
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  privateShowPosts: (check, user_id) => {
    return new Promise((resolve, reject) => {
      try {
        let status = 0;
        if (check) status = 1;

        const sql = "UPDATE private SET posts = ? WHERE user_id= ?";
        db.query(sql, [status, user_id], (err) => {
          if (err) return reject(err);
          return resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  getFriend: (user_id) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = `SELECT friend.status AS ap, friend.user_id_2 AS user_id_2,friend.date AS t, account.* FROM friend 
                INNER JOIN account ON (account.id = friend.user_id OR account.id = friend.user_id_2) 
                WHERE (friend.user_id = ? OR friend.user_id_2 = ?)`;
        db.query(sql, [user_id, user_id], (err, res) => {
          if (err) return reject(err);
          data = [];
          req = [];

          res.map((value) => {
            if (value.id !== user_id) {
              if (value.ap === 1) {
                text = {
                  id: value.id,
                  name: value.name,
                  image: value.image,
                };
                data.push(text);
              } else {
                if (value.user_id_2 === user_id) {
                  text = {
                    id: value.id,
                    name: value.name,
                    image: value.image,
                    time: value.t.getTime(),
                  };
                  req.push(text);
                }
              }
            }
          });
          return resolve({
            data: data,
            req: req,
          });
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  getRequestFriend: (user_id) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = `SELECT * FROM friend LEFT JOIN account ON friend.user_id = account.id 
                WHERE friend.user_id_2 = ? AND friend.status = 0`;
        db.query(sql, [user_id], (err, res) => {
          if (err) return reject(err);
          data = [];

          res.map((value) => {
            text = {
              id: value.id,
              name: value.name,
              image: value.image,
            };
            data.push(text);
          });

          return resolve(data);
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
};
