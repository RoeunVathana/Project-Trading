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

const MachineRoute = (app) => {
  app.get("/api/machines", getMachines);
  app.get("/api/machines/top", getTopMachines);
  app.get("/api/machines/:id", getMachineById);
  app.post("/api/machines/:id/view", recordMachineView);
  app.post("/api/machines", Authorization, uploadMachineMedia, createMachine);
  app.put("/api/machines/:id", Authorization, uploadMachineMedia, updateMachine);
  app.patch("/api/machines/:id", Authorization, uploadMachineMedia, updateMachine);
  app.delete("/api/machines/:id", Authorization, deleteMachine);
};

module.exports = MachineRoute;
