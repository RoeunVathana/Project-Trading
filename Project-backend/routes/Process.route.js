const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controller/Process.controller");
const Authorization = require("../middlewares/Authorization");

const ProcessRoute = (app) => {
  app.get("/api/processes", getAll);
  app.get("/api/processes/:id", getById);
  app.post("/api/processes", Authorization, create);
  app.put("/api/processes/:id", Authorization, update);
  app.patch("/api/processes/:id", Authorization, update);
  app.delete("/api/processes/:id", Authorization, remove);
};

module.exports = ProcessRoute;
