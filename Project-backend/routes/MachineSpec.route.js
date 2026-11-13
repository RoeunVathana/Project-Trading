const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controller/MachineSpec.controller");
const Authorization = require("../middlewares/Authorization");
const { requirePermission } = Authorization;

const MachineSpecRoute = (app) => {
  app.get("/api/machine-specs", getAll);
  app.get("/api/machine-specs/:id", getById);
  app.post("/api/machine-specs", Authorization, requirePermission("specs", "create"), create);
  app.put("/api/machine-specs/:id", Authorization, requirePermission("specs", "update"), update);
  app.patch("/api/machine-specs/:id", Authorization, requirePermission("specs", "update"), update);
  app.delete("/api/machine-specs/:id", Authorization, requirePermission("specs", "delete"), remove);
};

module.exports = MachineSpecRoute;
