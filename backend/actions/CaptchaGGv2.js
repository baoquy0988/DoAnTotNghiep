const axios = require("axios").default;
const secret = "6Lf0rUAmAAAAAE1AyVX4_PCJiPfyIl2yM305eRNq";

module.exports = {
  validateHuman: (token) => {
    return new Promise(async (resolve) => {
      axios
        .get(
          `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
        )
        .then((res) => {
          return resolve(res.data.success);
        })
        .catch(() => {
          return resolve(false);
        });
    });
  },
};
