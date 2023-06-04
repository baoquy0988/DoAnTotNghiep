const db = require("../db");

const getNumberPosts = (user_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT COUNT(*) FROM posts WHERE user_id = ? LIMIT 1";
    db.query(sql, [user_id], (err, res) => {
      if (err) return reject(err);
      return resolve(res[0]["COUNT(*)"]);
    });
  });
};
const getBand = (user_id, value) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT time, date FROM ban WHERE user_id = ?";

    db.query(sql, [user_id], async (err, res) => {
      if (err) return reject(err);
      res = res[0];

      let band = false;
      if (res) {
        //Kiểm tra thời gian ban
        //Nếu band vĩnh viễn
        if (res.time === -1) band = true;
        newDateObj = new Date(res.date.getTime() + res.time * 60000);
        //Hết thời gian band
        if (newDateObj > Date.now()) band = newDateObj.getTime();
      }

      const status =
        band !== false ? "pending" : value === 1 ? "completed" : "failed";
      return resolve(status);
    });
  });
};

module.exports = {
  get: () => {
    return new Promise((resolve, reject) => {
      try {
        const sql = "SELECT * FROM account WHERE level = 0";
        db.query(sql, async (err, res) => {
          if (err) return reject(err);
          data = [];
          const get_data = res.map(async (value) => {
            text = {
              id: value.id,
              status: await getBand(value.id, value.status),
              username: value.username,
              email: value.email,
              name: value.name,
              count: await getNumberPosts(value.id),
            };
            return text;
          });

          data = await Promise.all(get_data);
          return resolve(data);
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  editUser: (data) => {
    return new Promise((resolve, reject) => {
      try {
        user_id = data.id;
        username = data.username;
        //Kiểm tra xem username có tồn tại trước đó hay không
        const sql =
          "SELECT * FROM  account WHERE username = ? AND id <> ? LIMIT 1";
        db.query(sql, [username, user_id], (err, res) => {
          if (err) return reject(err);
          res = res[0];
          //Có tốn tại
          if (res) return resolve(false);

          const sql =
            "UPDATE account SET username = ?, name = ?, email = ?, status = ? WHERE id = ?";
          db.query(
            sql,
            [
              username,
              data.name,
              data.email,
              data.status === "completed" ? 1 : 0,
              user_id,
            ],
            (err, res) => {
              if (err) return reject(err);
              return resolve(true);
            }
          );
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  //Chỉ xóa tài khoản
  delUser: (user_id) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = "UPDATE account SET die = 1 WHERE id = ?";
        db.query(sql, [user_id], (err, res) => {
          if (err) return reject(err);
          return resolve();
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  //Mở khóa tài khoản
  openBand: (user_id) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = "DELETE FROM ban WHERE user_id = ?";
        db.query(sql, [user_id], (err) => {
          if (err) return reject(err);
          const sql = "SELECT status FROM account WHERE id= ? LIMIT 1";
          db.query(sql, [user_id], (err, res) => {
            if (err) return reject(err);
            const status = res[0].status === 1 ? "completed" : "failed";
            return resolve(status);
          });
        });
      } catch (error) {
        return reject(error);
      }
    });
  },

  //Khóa tài khoản
  bandAcc: (user_id, time, reason) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = "DELETE FROM ban WHERE user_id = ?";
        db.query(sql, [user_id], (err) => {
          if (err) return reject(err);
          if (reason !== "") {
            const sql =
              "INSERT INTO ban (user_id, time, reason) VALUES (?, ?, ?)";
            db.query(sql, [user_id, time, reason], (err) => {
              if (err) return reject(err);
              return resolve();
            });
          } else {
            const sql = "INSERT INTO ban (user_id, time) VALUES (?, ?)";
            db.query(sql, [user_id, time], (err) => {
              if (err) return reject(err);
              return resolve();
            });
          }
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
};
