const {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
} = require("../controller/Machine.controller");
const { uploadImage } = require("../utils/Upload");
const Authorization = require("../middlewares/Authorization");

const MachineRoute = (app) => {
  app.get("/api/machines", getMachines);
  app.get("/api/machines/:id", getMachineById);
  app.post("/api/machines", Authorization, uploadImage, createMachine);
  app.put("/api/machines/:id", Authorization, uploadImage, updateMachine);
  app.patch("/api/machines/:id", Authorization, uploadImage, updateMachine);
  app.delete("/api/machines/:id", Authorization, deleteMachine);
};

module.exports = MachineRoute;
