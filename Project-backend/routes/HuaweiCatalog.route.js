const Authorization = require("../middlewares/Authorization");
const { requirePermission } = Authorization;
const controllers = require("../controller/HuaweiCatalog.controller");
const { uploadImage } = require("../utils/Upload");
const { uploadPdf } = require("../utils/PdfUpload");

const register = (app, path, controller, compositePath = ":id", upload = null, permissionResource = path) => {
  app.get(`/api/${path}`, controller.getAll);
  app.get(`/api/${path}/${compositePath}`, controller.getById);
  app.post(`/api/${path}`, Authorization, requirePermission(permissionResource, "create"), ...(upload ? [upload] : []), controller.create);
  app.put(`/api/${path}/${compositePath}`, Authorization, requirePermission(permissionResource, "update"), ...(upload ? [upload] : []), controller.update);
  app.patch(`/api/${path}/${compositePath}`, Authorization, requirePermission(permissionResource, "update"), ...(upload ? [upload] : []), controller.update);
  app.delete(`/api/${path}/${compositePath}`, Authorization, requirePermission(permissionResource, "delete"), controller.remove);
};

const HuaweiCatalogRoute = (app) => {
  register(app, "huawei-product-images", controllers.productImages, ":id", uploadImage, "huaweiImages");
  register(app, "huawei-product-pdfs", controllers.productPdfs, ":id", uploadPdf, "huaweiPdfs");
};

module.exports = HuaweiCatalogRoute;
