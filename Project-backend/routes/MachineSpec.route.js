const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controller/MachineSpec.controller");
const Authorization = require("../middlewares/Authorization");

const MachineSpecRoute = (app) => {
  app.get("/api/machine-specs", getAll);
  app.get("/api/machine-specs/:id", getById);
  app.post("/api/machine-specs", Authorization, create);
  app.put("/api/machine-specs/:id", Authorization, update);
  app.patch("/api/machine-specs/:id", Authorization, update);
  app.delete("/api/machine-specs/:id", Authorization, remove);
};

module.exports = MachineSpecRoute;
