const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controller/MachineGallery.controller");
const { uploadImage } = require("../utils/Upload");

const MachineGalleryRoute = (app) => {
  app.get("/api/machine-galleries", getAll);
  app.get("/api/machine-galleries/:id", getById);
  app.post("/api/machine-galleries", uploadImage, create);
  app.put("/api/machine-galleries/:id", uploadImage, update);
  app.patch("/api/machine-galleries/:id", uploadImage, update);
  app.delete("/api/machine-galleries/:id", remove);
};

module.exports = MachineGalleryRoute;
