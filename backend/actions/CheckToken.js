const db = require("../db");
const jwt = require("jsonwebtoken");
const time_token = 6000;
module.exports = {
  checkToken: (_token) => {
    return new Promise((resolve) => {
      token_decode = jwt.decode(_token);
      try {
        iat = token_decode.iat;
        data = token_decode.data;
      } catch (error) {
        return resolve(false);
      }

      const sql = "SELECT * FROM token WHERE value = ? LIMIT 1";
      db.query(sql, [_token], (err, reponse) => {
        if (err) throw err;
        reponse = reponse[0];
        if (reponse === undefined) resolve(false);
        time = Math.floor((Date.now() - iat) / 1000 / 60);
        if (time > time_token) resolve(true);
        else
          resolve({
            data: token_decode.data,
          });
      });
    });
  },
};
