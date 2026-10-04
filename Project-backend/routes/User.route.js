const {
  register,
  login,
  getCurrentUser,
} = require("../controller/User.controller");
const Authorization = require("../middlewares/Authorization");

const UserRoute = (app) => {
  app.post("/api/users", register);
  app.post("/api/users/register", register);
  app.post("/api/users/login", login);
  app.get("/api/users/me", Authorization, getCurrentUser);
};

module.exports = UserRoute;
