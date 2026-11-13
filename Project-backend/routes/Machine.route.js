const {
  getMachines,
  getMachineById,
  getTopMachines,
  recordMachineView,
  createMachine,
  updateMachine,
  deleteMachine,
} = require("../controller/Machine.controller");
const { uploadMachineMedia } = require("../utils/Upload");
const Authorization = require("../middlewares/Authorization");
const { requirePermission } = Authorization;

const MachineRoute = (app) => {
  app.get("/api/machines", getMachines);
  app.get("/api/machines/top", getTopMachines);
  app.get("/api/machines/:id", getMachineById);
  app.post("/api/machines/:id/view", recordMachineView);
  app.post("/api/machines", Authorization, requirePermission("machines", "create"), uploadMachineMedia, createMachine);
  app.put("/api/machines/:id", Authorization, requirePermission("machines", "update"), uploadMachineMedia, updateMachine);
  app.patch("/api/machines/:id", Authorization, requirePermission("machines", "update"), uploadMachineMedia, updateMachine);
  app.delete("/api/machines/:id", Authorization, requirePermission("machines", "delete"), deleteMachine);
};

module.exports = MachineRoute;
