const controller = require("../controller/HuaweiCategory.controller");
const Authorization = require("../middlewares/Authorization");

const HuaweiCategoryRoute = (app) => {
  app.get("/api/huawei-categories", controller.getAll);
  app.get("/api/huawei-categories/:id", controller.getById);
  app.post("/api/huawei-categories", Authorization, controller.create);
  app.put("/api/huawei-categories/:id", Authorization, controller.update);
  app.patch("/api/huawei-categories/:id", Authorization, controller.update);
  app.delete("/api/huawei-categories/:id", Authorization, controller.remove);
};

module.exports = HuaweiCategoryRoute;
