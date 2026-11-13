const {
  register,
  login,
  getCurrentUser,
  getUsers,
  updateUser,
  updateCurrentUser,
  deleteUser,
} = require("../controller/User.controller");
const Authorization = require("../middlewares/Authorization");
const { requireRole } = Authorization;
const { uploadImage } = require("../utils/Upload");

const UserRoute = (app) => {
  app.get("/api/users", Authorization, requireRole("admin"), getUsers);
  app.post("/api/users/manage", Authorization, requireRole("admin"), uploadImage, register);
  app.post("/api/users", Authorization, requireRole("admin"), uploadImage, register);
  app.post("/api/users/register", uploadImage, register);
  app.post("/api/users/login", login);
  app.get("/api/users/me", Authorization, getCurrentUser);
  app.put("/api/users/me", Authorization, uploadImage, updateCurrentUser);
  app.patch("/api/users/me", Authorization, uploadImage, updateCurrentUser);
  app.put("/api/users/:id", Authorization, requireRole("admin"), uploadImage, updateUser);
  app.patch("/api/users/:id", Authorization, requireRole("admin"), uploadImage, updateUser);
  app.delete("/api/users/:id", Authorization, requireRole("admin"), deleteUser);
};

module.exports = UserRoute;
