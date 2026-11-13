const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controller/MachineGallery.controller");
const { uploadImage } = require("../utils/Upload");
const Authorization = require("../middlewares/Authorization");
const { requirePermission } = Authorization;

const MachineGalleryRoute = (app) => {
  app.get("/api/machine-galleries", getAll);
  app.get("/api/machine-galleries/:id", getById);
  app.post("/api/machine-galleries", Authorization, requirePermission("gallery", "create"), uploadImage, create);
  app.put("/api/machine-galleries/:id", Authorization, requirePermission("gallery", "update"), uploadImage, update);
  app.patch("/api/machine-galleries/:id", Authorization, requirePermission("gallery", "update"), uploadImage, update);
  app.delete("/api/machine-galleries/:id", Authorization, requirePermission("gallery", "delete"), remove);
};

module.exports = MachineGalleryRoute;
