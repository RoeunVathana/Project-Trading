const {
  register,
  login,
  getCurrentUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controller/User.controller");
const Authorization = require("../middlewares/Authorization");
const { uploadImage } = require("../utils/Upload");

const UserRoute = (app) => {
  app.get("/api/users", Authorization, getUsers);
  app.post("/api/users/manage", Authorization, uploadImage, register);
  app.post("/api/users", uploadImage, register);
  app.post("/api/users/register", uploadImage, register);
  app.post("/api/users/login", login);
  app.get("/api/users/me", Authorization, getCurrentUser);
  app.put("/api/users/:id", Authorization, uploadImage, updateUser);
  app.patch("/api/users/:id", Authorization, uploadImage, updateUser);
  app.delete("/api/users/:id", Authorization, deleteUser);
};

module.exports = UserRoute;
