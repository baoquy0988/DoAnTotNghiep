const db = require("../db");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
var moment = require("moment");
const checkToken = require("./checkToken");

function titleURL(str) {
  str = str.toLowerCase().trim();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  str = str.replace(/[^a-z0-9]/gi, " ");
  return str.replace(/\s+/g, "-");
}

const getReplyCommet = (comment_id) => {
  return new Promise(async (resolve) => {
    const sql =
      "SELECT * FROM reply_comment as reply INNER JOIN account ON reply.user_id = account.id WHERE reply.comment_id = ? ORDER BY reply.date DESC";
    await db.query(sql, [comment_id], (err, reponse) => {
      reply = [];
      reponse.map((value) => {
        text = {
          user_id: value.user_id,
          content: value.content,
          date: value.date.getTime(),
          name: value.name,
          image: value.image,
        };
        reply.push(text);
      });
      resolve(reply);
    });
  });
};

const formatDay = (date) => {
  dayNow = moment(Date.now()).format("DD-MM-YYYY");
  day = moment(date).format("DD-MM-YYYY");

  if (day === dayNow)
    return (day = moment(date).format("HH:mm") + " • Hôm nay");
  return moment(date).format("HH:mm • DD-MM-YYYY ");
};

module.exports = {
  save: (data, user_id) => {
    return new Promise(async (resolve) => {
      title = data.title;
      content = data.content;
      content = jwt.sign({ content }, "shhhhh");
      const sql =
        "INSERT INTO posts_save (user_id, title, content) VALUES (?, ?, ?)";
      db.query(sql, [user_id, title, content], function (err, res) {
        if (err) resolve(false);
        resolve(true);
      });
    });
  },
  statusPost: (id, status, user_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "UPDATE posts SET share = ? WHERE id = ? AND user_id = ?";
        db.query(sql, [status, id, user_id], (err) => {
          if (err) return reject(err);
          return resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  lock: (id, user_id) => {
    return new Promise((resolve) => {
      try {
        const sql = "UPDATE posts SET status = 0 WHERE id = ? AND user_id = ?";
        db.query(sql, [id, user_id], (err) => {
          if (err) return resolve(false);
          return resolve(true);
        });
      } catch (error) {
        return resolve(false);
      }
    });
  },
  open: (id, user_id) => {
    return new Promise((resolve) => {
      try {
        const sql = "UPDATE posts SET status = 1 WHERE id = ? AND user_id = ?";
        db.query(sql, [id, user_id], (err) => {
          if (err) return resolve(false);
          return resolve(true);
        });
      } catch (error) {
        return resolve(false);
      }
    });
  },

  add: (req, user_id, user_name, user_image) => {
    return new Promise(async (resolve, reject) => {
      try {
        content = req.content;
        title = req.name;
        share = req.share;

        content = jwt.sign({ content }, "shhhhh");

        const sql =
          "INSERT INTO posts (user_id, content, title, url, share) VALUES (?, ?, ?, ?, ?)";
        const title_url = titleURL(title);
        db.query(
          sql,
          [user_id, content, title, title_url, share],
          function (err, result) {
            if (err) return reject();
            return resolve({
              id: result.insertId,
              name: title,
              user_id: user_id,
              user_name: user_name,
              image: user_image,
              content: req.content,
              n_comments: 0,
              n_like: 0,
              date: Date.now(),
              url: "/post/" + result.insertId + "/" + title_url,
              url_short: title_url,
              user_like: false,
              status: true,
              share: share.toString(),
            });
          }
        );
      } catch (error) {
        return reject(false);
      }
    });
  },
  edit: (data, user_id) => {
    return new Promise(async (resolve) => {
      try {
        content = data.content;
        content = jwt.sign({ content }, "shhhhh");
        const title_url = titleURL(data.title);
        const sql =
          "UPDATE posts SET content = ?, title = ?, url = ? WHERE id = ? AND user_id = ?";
        db.query(
          sql,
          [content, data.title, title_url, data.id, user_id],
          (err) => {
            if (err) return resolve(false);
            return resolve(true);
          }
        );
      } catch (error) {
        return resolve(false);
      }
    });
  },
  editSave: (data, user_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        content = data.content;
        content = jwt.sign({ content }, "shhhhh");
        const title_url = titleURL(data.title);
        const sql =
          "UPDATE posts_save SET content = ?, title = ?WHERE id = ? AND user_id = ?";
        db.query(sql, [content, data.title, data.id, user_id], (err) => {
          if (err) return reject(err);
          return resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  get: (topic, _user_id) => {
    return new Promise((resolve, reject) => {
      try {
        let login = false;
        let user_id = -1;
        if (_user_id) {
          user_id = _user_id;
          login = true;
        }
        const sql = "SELECT post_id FROM post_like WHERE user_id = ?";

        db.query(sql, [user_id], (err, n_like) => {
          if (err) return reject(err);
          const check_like = n_like.length !== 0;
          const sql =
            "SELECT * FROM account INNER JOIN posts ON posts.user_id = account.id WHERE posts.share = 0 ORDER BY posts.date DESC";

          db.query(sql, async function (err, reponse) {
            if (err) return reject(err);
            if (reponse.length === 0) return resolve([]);

            const get_all = reponse.map((value) => {
              return {
                id: value.id,
                name: value.title,
                user_id: value.user_id,
                user_name: value.name,
                image: value.image,
                content: jwt.decode(value.content).content,
                n_comments: value.n_comments,
                n_like: value.n_like,
                date: value.date.getTime(),
                url: "/post/" + value.id + "/" + value.url,
                url_short: value.url,
                status: value.status === 1,
                user_like:
                  check_like === false
                    ? false
                    : n_like.find((item) => item.post_id === value.id) !==
                      undefined,
              };
            });

            const data = await Promise.all(get_all);
            return resolve({ data: data, login: login });
          });
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  like: async (post_id, user_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "SELECT * FROM posts WHERE id = ? LIMIT 1";
        db.query(sql, [post_id], (err, reponse) => {
          if (err) return reject(err);

          user_id_post = reponse[0].user_id;
          url_post = "/post/" + reponse[0].id + "/" + reponse[0].url;

          title_post = reponse[0].title;

          const sql =
            "SELECT * FROM post_like WHERE user_id = ? AND post_id = ? LIMIT 1";
          db.query(sql, [user_id, post_id], (err, reponse) => {
            if (err) return reject(err);

            reponse = reponse[0];
            if (reponse === undefined) {
              const sql = "UPDATE posts SET n_like = n_like + 1 WHERE id = ?";
              db.query(sql, [post_id], (err) => {
                if (err) return reject(err);
                const sql =
                  "INSERT INTO post_like (user_id, post_id) VALUES (?, ?)";
                db.query(sql, [user_id, post_id], (err) => {
                  if (err) return reject(err);
                  resolve({
                    like: true,
                    post_id: post_id,
                    user_id: user_id_post,
                    name_like: token_decode.data.name,
                    url_post: url_post,
                    title_post: title_post,
                    time: Date.now(),
                  });
                });
              });
            } else {
              const sql = "UPDATE posts SET n_like = n_like - 1 WHERE id = ?";
              db.query(sql, [post_id], () => {
                const sql =
                  "DELETE FROM post_like WHERE user_id = ? AND post_id = ?";
                db.query(sql, [user_id, post_id], (err) => {
                  if (err) return reject(err);
                  return resolve({
                    like: false,
                    post_id: post_id,
                    user_id: user_id_post,
                    name_like: token_decode.data.name,
                    url_post: url_post,
                    title_post: title_post,
                    time: Date.now(),
                  });
                });
              });
            }
          });
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  detail: async (post_id, post_url, user_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        like = false;

        if (user_id) {
          like = true;
          const sql =
            "SELECT * FROM post_like WHERE user_id = ? AND post_id = ? LIMIT 1";
          db.query(sql, [user_id, post_id], (err, reponse) => {
            if (err) return reject(err);
            reponse = reponse[0];
            like = reponse !== undefined;
          });
        }

        const sql =
          "SELECT * FROM account INNER JOIN posts ON posts.user_id = account.id WHERE posts.id = ? LIMIT 1";
        db.query(sql, [post_id], function (err, reponse) {
          if (err) return reject(err);
          reponse = reponse[0];

          if (!reponse) return resolve();
          if (reponse.share === 2 && user_id !== reponse.user_id)
            return resolve(2);
          if (reponse.share === 1 && user_id !== reponse.user_id) {
            const sql =
              "SELECT * FROM friend WHERE (user_id = ? AND user_id_2 = ?) OR (user_id = ? AND user_id_2 = ?) LIMIT 1";
            db.query(
              sql,
              [user_id, reponse.user_id, reponse.user_id, user_id],
              (err, friend) => {
                if (err) return reject(err);
                friend = friend[0];
                if (!friend) return resolve(1);
                navigation = false;
                if (reponse.url !== post_url) navigation = true;
                const sql = `SELECT * FROM account INNER JOIN comments 
                        ON comments.user_id = account.id WHERE comments.post_id = ? ORDER BY comments.date`;
                db.query(sql, [reponse.id], async (err, user) => {
                  if (err) return reject(err);

                  const result = user.map(async (value) => {
                    reply = await getReplyCommet(value.id);
                    text = {
                      id: value.id,
                      user_id: value.user_id,
                      name: value.name,
                      content: value.content,
                      date: value.date.getTime(),
                      image: value.image,
                      reply: reply,
                    };
                    return text;
                  });

                  const data = await Promise.all(result);

                  return resolve({
                    navigation: navigation,
                    data: {
                      id: reponse.id,
                      name: reponse.title,
                      user_id: reponse.user_id,
                      user_name: reponse.name,
                      image: reponse.image,
                      content: jwt.decode(reponse.content).content,
                      n_comments: reponse.n_comments,
                      comments: data,
                      n_like: reponse.n_like,
                      date:
                        moment(reponse.date).format("DD-MM-YYYY") +
                        " lúc " +
                        moment(reponse.date).format("HH:mm"),
                      url: "/post/" + reponse.id + "/" + reponse.url,
                      user_like: like,
                      status: reponse.status === 1,
                      share: reponse.share,
                    },
                  });
                });
              }
            );
          }
          if (reponse.share === 0 || user_id === reponse.user_id) {
            navigation = false;
            if (reponse.url !== post_url) navigation = true;

            const sql = `SELECT * FROM account INNER JOIN comments 
                        ON comments.user_id = account.id WHERE comments.post_id = ? ORDER BY comments.date`;
            db.query(sql, [reponse.id], async (err, user) => {
              if (err) return reject(err);

              const result = user.map(async (value) => {
                reply = await getReplyCommet(value.id);
                text = {
                  id: value.id,
                  user_id: value.user_id,
                  name: value.name,
                  content: value.content,
                  date: value.date.getTime(),
                  image: value.image,
                  reply: reply,
                };
                return text;
              });

              const data = await Promise.all(result);

              return resolve({
                navigation: navigation,
                data: {
                  id: reponse.id,
                  name: reponse.title,
                  user_id: reponse.user_id,
                  user_name: reponse.name,
                  image: reponse.image,
                  content: jwt.decode(reponse.content).content,
                  n_comments: reponse.n_comments,
                  comments: data,
                  n_like: reponse.n_like,
                  date:
                    moment(reponse.date).format("DD-MM-YYYY") +
                    " lúc " +
                    moment(reponse.date).format("HH:mm"),
                  url: "/post/" + reponse.id + "/" + reponse.url,
                  user_like: like,
                  status: reponse.status === 1,
                  share: reponse.share,
                },
              });
            });
          }
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  trend: async () => {
    return new Promise((resolve) => {
      const sql =
        "SELECT * FROM account INNER JOIN posts WHERE posts.user_id = account.id ORDER BY n_like + n_comments DESC LIMIT 6";
      db.query(sql, (err, reponse) => {
        if (err) return resolve(false);
        data = [];
        reponse.map((value) => {
          text = {
            id: value.id,
            user_id: value.user_id,
            user_name: value.name,
            image: value.image,
            content: jwt.decode(value.content).content,
            name: value.title.trim(),
            url: "/post/" + value.id + "/" + value.url,
            n_like: value.n_like,
            n_comments: value.n_comments,
            date: formatDay(value.date),
            user_like: false,
          };
          data.push(text);
        });
        return resolve(data);
      });
    });
  },
  postsOfUser: (user_id, user_id_post) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sqll = "SELECT posts FROM private WHERE user_id = ?";
        db.query(sqll, [user_id_post], (err, res) => {
          if (err) return reject(err);
          const show = res[0].posts === 1;
          if (show) {
            const sql =
              "SELECT post_id FROM post_like INNER JOIN posts ON post_like.post_id = posts.id WHERE posts.user_id = ? AND post_like.user_id = ?";
            db.query(sql, [user_id_post, user_id], (err, res) => {
              if (err) return reject(false);

              posts_like = [];
              res.map((value) => {
                posts_like.push(value.post_id);
              });
              const sql =
                "SELECT * FROM account INNER JOIN posts ON posts.user_id = account.id WHERE posts.user_id = ? ORDER BY posts.date DESC";
              db.query(sql, [user_id_post], (err, res) => {
                if (err) return reject(false);
                data = [];

                if (res.length !== 0) {
                  res.map((value) => {
                    data.push({
                      id: value.id,
                      name: value.title,
                      user_id: value.user_id,
                      user_name: value.name,
                      image: value.image,
                      content: jwt.decode(value.content).content,
                      n_comments: value.n_comments,
                      n_like: value.n_like,
                      date: value.date.getTime(),
                      url: "/post/" + value.id + "/" + value.url,
                      url_short: value.url,
                      status: value.status === 1,
                      user_like: posts_like.indexOf(value.id) !== -1,
                    });
                  });
                  return resolve(data);
                } else return resolve([]);
              });
            });
          } else {
            return resolve([]);
          }
        });
      } catch {
        return reject(false);
      }
    });
  },
  deletePostSave: (id, user_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = "DELETE FROM posts_save WHERE id=? AND user_id = ?";
        db.query(sql, [id, user_id], (err) => {
          if (err) return reject(err);
          return resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  search: (text, user_id) => {
    return new Promise((resolve, reject) => {
      try {
        if (!user_id) {
          const sql = `SELECT * FROM account INNER JOIN posts ON posts.user_id = account.id 
                WHERE (posts.share = 0 AND posts.title LIKE '%${text}%') ORDER BY posts.date DESC`;

          db.query(sql, (err, res) => {
            if (err) return reject(err);
            data = [];

            res.map((value) => {
              text = {
                user_id: value.user_id,
                user_name: value.name,
                user_image: value.image,
                title_post: value.title,
                url_post: "/post/" + value.id + "/" + value.url,
                time_post: value.date.getTime(),
                n_cmt: value.n_comments,
                n_like: value.n_like,
              };
              data.push(text);
            });

            return resolve(data);
          });
        } else {
          const sql =
            "SELECT * FROM friend WHERE (friend.user_id = ? OR friend.user_id_2 = ?) AND friend.status = 1";
          db.query(sql, [user_id, user_id], (err, res) => {
            if (err) return reject(err);
            friend = [user_id];
            res.map((value) => {
              if (value.user_id === user_id) friend.push(value.user_id_2);
              else friend.push(value.user_id);
            });
            const sql = `SELECT * FROM account INNER JOIN posts ON posts.user_id = account.id 
                            WHERE (posts.share <> 2 AND posts.title LIKE '%${text}%') ORDER BY posts.date DESC`;

            db.query(sql, [text], (err, res) => {
              if (err) return reject(err);
              data = [];

              res.map((value) => {
                _type = 2;
                if (value.user_id === user_id) _type = 0;
                else if (friend.indexOf(value.user_id) !== -1) _type = 1;

                text = {
                  user_id: value.user_id,
                  user_name: value.name,
                  user_image: value.image,
                  title_post: value.title,
                  url_post: "/post/" + value.id + "/" + value.url,
                  time_post: value.date.getTime(),
                  n_cmt: value.n_comments,
                  n_like: value.n_like,
                  type: _type,
                };
                data.push(text);
              });
              return resolve(data);
            });
          });
        }
      } catch (error) {
        return reject(error);
      }
    });
  },
  getPostPublic: () => {
    return new Promise((resolve, reject) => {
      try {
        const sql =
          "SELECT * FROM account INNER JOIN posts ON posts.user_id = account.id WHERE posts.share = 0 ORDER BY posts.date";

        db.query(sql, async function (err, reponse) {
          if (err) return reject(err);
          if (reponse.length === 0) return resolve([]);

          const get_all = reponse.map(async (value) => {
            const _likes = () => {
              return new Promise((resolve, reject) => {
                const sql = "SELECT user_id FROM post_like WHERE post_id = ?";
                db.query(sql, value.id, (err, res) => {
                  if (err) return reject(err);
                  like = [];
                  res.map((item) => {
                    like.push(item.user_id);
                  });
                  return resolve(like);
                });
              });
            };

            const likes = await _likes();

            return {
              id: value.id,
              name: value.title,
              user_id: value.user_id,
              user_name: value.name,
              image: value.image,
              content: jwt.decode(value.content).content,
              n_comments: value.n_comments,
              n_like: value.n_like,
              date: value.date.getTime(),
              url: "/post/" + value.id + "/" + value.url,
              url_short: value.url,
              status: value.status === 1,
              likes: likes,
            };
          });

          const data = await Promise.all(get_all);
          return resolve(data);
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
};
