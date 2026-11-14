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
const { createRateLimiter } = require("../middlewares/RateLimit");

const loginRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many sign-in attempts. Please try again later.",
});
const registrationRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: "Too many registration attempts. Please try again later.",
});

const UserRoute = (app) => {
  app.get("/api/users", Authorization, requireRole("admin"), getUsers);
  app.post("/api/users/manage", Authorization, requireRole("admin"), uploadImage, register);
  app.post("/api/users", Authorization, requireRole("admin"), uploadImage, register);
  app.post("/api/users/register", registrationRateLimit, uploadImage, register);
  app.post("/api/users/login", loginRateLimit, login);
  app.get("/api/users/me", Authorization, getCurrentUser);
  app.put("/api/users/me", Authorization, uploadImage, updateCurrentUser);
  app.patch("/api/users/me", Authorization, uploadImage, updateCurrentUser);
  app.put("/api/users/:id", Authorization, requireRole("admin"), uploadImage, updateUser);
  app.patch("/api/users/:id", Authorization, requireRole("admin"), uploadImage, updateUser);
  app.delete("/api/users/:id", Authorization, requireRole("admin"), deleteUser);
};

module.exports = UserRoute;
