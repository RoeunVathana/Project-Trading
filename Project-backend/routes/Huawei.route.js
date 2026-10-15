const controller = require("../controller/Huawei.controller");
const Authorization = require("../middlewares/Authorization");

const HuaweiRoute = (app) => {
  app.get("/api/huawei", controller.getAll);
  app.get("/api/huawei/:id", controller.getById);
  app.post("/api/huawei", Authorization, controller.create);
  app.put("/api/huawei/:id", Authorization, controller.update);
  app.patch("/api/huawei/:id", Authorization, controller.update);
  app.delete("/api/huawei/:id", Authorization, controller.remove);
};

module.exports = HuaweiRoute;
