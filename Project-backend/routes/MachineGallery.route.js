const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controller/MachineGallery.controller");
const { uploadImage } = require("../utils/Upload");
const Authorization = require("../middlewares/Authorization");

const MachineGalleryRoute = (app) => {
  app.get("/api/machine-galleries", getAll);
  app.get("/api/machine-galleries/:id", getById);
  app.post("/api/machine-galleries", Authorization, uploadImage, create);
  app.put("/api/machine-galleries/:id", Authorization, uploadImage, update);
  app.patch("/api/machine-galleries/:id", Authorization, uploadImage, update);
  app.delete("/api/machine-galleries/:id", Authorization, remove);
};

module.exports = MachineGalleryRoute;
