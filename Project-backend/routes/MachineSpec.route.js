const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controller/MachineSpec.controller");

const MachineSpecRoute = (app) => {
  app.get("/api/machine-specs", getAll);
  app.get("/api/machine-specs/:id", getById);
  app.post("/api/machine-specs", create);
  app.put("/api/machine-specs/:id", update);
  app.patch("/api/machine-specs/:id", update);
  app.delete("/api/machine-specs/:id", remove);
};

module.exports = MachineSpecRoute;
