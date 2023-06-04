const Email = require("./SendMail");
const db = require("../db");
const jwt = require("jsonwebtoken");

const time_token = 10;

module.exports = {
  request: (user_id, user_name) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = "SELECT email FROM account WHERE id = ?";
        db.query(sql, [user_id], (err, res) => {
          if (err) return reject(err);
          _email = res[0].email;
          if (_email) {
            token = jwt.sign(
              { id_account: user_id, iat: Date.now() },
              "shhhhh"
            );
            const sql = "INSERT INTO token_email (value) VALUES (?)";
            db.query(sql, [token], async (err) => {
              if (err) return reject(err);
              url = "http://localhost:3000/confirm?token=";
              if (await Email.Sender(_email, url + token, user_name))
                return resolve(true);
              else return resolve(false);
            });
          } else return resolve(false);
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
  confirm: (token_mail) => {
    return new Promise((resolve, reject) => {
      try {
        const sql = "SELECT id FROM token_email WHERE value = ? LIMIT 1";
        db.query(sql, [token_mail], (err, res) => {
          if (err) return reject(err);
          res = res[0];

          if (res) {
            id = res.id;
            token_mail = jwt.decode(token_mail);
            time = Math.floor((Date.now() - token_mail.iat) / 1000 / 60);
            if (time > time_token) return resolve();
            const sql = "UPDATE account SET status = 1 WHERE id = ?";
            db.query(sql, [token_mail.id_account], (err) => {
              if (err) return reject(err);
              const sql = "DELETE FROM token_email WHERE id = ?";
              db.query(sql, [id], (err) => {
                if (err) return reject(err);
                return resolve(token_mail.id_account);
              });
            });
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
