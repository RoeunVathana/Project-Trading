const Authorization = require("../middlewares/Authorization");
const controllers = require("../controller/HuaweiCatalog.controller");
const { uploadImage } = require("../utils/Upload");
const { uploadPdf } = require("../utils/PdfUpload");

const register = (app, path, controller, compositePath = ":id", upload = null) => {
  app.get(`/api/${path}`, controller.getAll);
  app.get(`/api/${path}/${compositePath}`, controller.getById);
  app.post(`/api/${path}`, Authorization, ...(upload ? [upload] : []), controller.create);
  app.put(`/api/${path}/${compositePath}`, Authorization, ...(upload ? [upload] : []), controller.update);
  app.patch(`/api/${path}/${compositePath}`, Authorization, ...(upload ? [upload] : []), controller.update);
  app.delete(`/api/${path}/${compositePath}`, Authorization, controller.remove);
};

const HuaweiCatalogRoute = (app) => {
  register(app, "huawei-product-images", controllers.productImages, ":id", uploadImage);
  register(app, "huawei-product-pdfs", controllers.productPdfs, ":id", uploadPdf);
};

module.exports = HuaweiCatalogRoute;
