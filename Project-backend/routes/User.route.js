const {
  register,
  login,
  getCurrentUser,
} = require("../controller/User.controller");
const Authorization = require("../middlewares/Authorization");
const { uploadImage } = require("../utils/Upload");

const UserRoute = (app) => {
  app.post("/api/users", uploadImage, register);
  app.post("/api/users/register", uploadImage, register);
  app.post("/api/users/login", login);
  app.get("/api/users/me", Authorization, getCurrentUser);
};

module.exports = UserRoute;
