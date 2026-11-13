const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controller/MachinePdf.controller");
const { uploadPdf } = require("../utils/PdfUpload");
const Authorization = require("../middlewares/Authorization");
const { requirePermission } = Authorization;

const MachinePdfRoute = (app) => {
  app.get("/api/machine-pdfs", getAll);
  app.get("/api/machine-pdfs/:id", getById);
  app.post("/api/machine-pdfs", Authorization, requirePermission("pdfs", "create"), uploadPdf, create);
  app.put("/api/machine-pdfs/:id", Authorization, requirePermission("pdfs", "update"), uploadPdf, update);
  app.patch("/api/machine-pdfs/:id", Authorization, requirePermission("pdfs", "update"), uploadPdf, update);
  app.delete("/api/machine-pdfs/:id", Authorization, requirePermission("pdfs", "delete"), remove);
};

module.exports = MachinePdfRoute;
