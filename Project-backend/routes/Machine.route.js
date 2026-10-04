const {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
} = require("../controller/Machine.controller");
const { uploadImage } = require("../utils/Upload");

const MachineRoute = (app) => {
  app.get("/api/machines", getMachines);
  app.get("/api/machines/:id", getMachineById);
  app.post("/api/machines", uploadImage, createMachine);
  app.put("/api/machines/:id", uploadImage, updateMachine);
  app.patch("/api/machines/:id", uploadImage, updateMachine);
  app.delete("/api/machines/:id", deleteMachine);
};

module.exports = MachineRoute;
