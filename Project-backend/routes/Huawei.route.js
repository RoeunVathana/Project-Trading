const controller = require("../controller/Huawei.controller");
const Authorization = require("../middlewares/Authorization");
const { requirePermission } = Authorization;
const { uploadImage } = require("../utils/Upload");

const HuaweiRoute = (app) => {
  app.get("/api/huawei", controller.getAll);
  app.get("/api/huawei/:id", controller.getById);
  app.post("/api/huawei", Authorization, requirePermission("huawei", "create"), uploadImage, controller.create);
  app.put("/api/huawei/:id", Authorization, requirePermission("huawei", "update"), uploadImage, controller.update);
  app.patch("/api/huawei/:id", Authorization, requirePermission("huawei", "update"), uploadImage, controller.update);
  app.delete("/api/huawei/:id", Authorization, requirePermission("huawei", "delete"), controller.remove);
};

module.exports = HuaweiRoute;
