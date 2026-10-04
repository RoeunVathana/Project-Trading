const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controller/MachinePdf.controller");
const { uploadPdf } = require("../utils/PdfUpload");

const MachinePdfRoute = (app) => {
  app.get("/api/machine-pdfs", getAll);
  app.get("/api/machine-pdfs/:id", getById);
  app.post("/api/machine-pdfs", uploadPdf, create);
  app.put("/api/machine-pdfs/:id", uploadPdf, update);
  app.patch("/api/machine-pdfs/:id", uploadPdf, update);
  app.delete("/api/machine-pdfs/:id", remove);
};

module.exports = MachinePdfRoute;
