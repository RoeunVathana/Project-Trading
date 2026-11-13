const {
  getCategories,
  getTopCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/Category.controller");
const Authorization = require("../middlewares/Authorization");
const { requirePermission } = Authorization;

const CategoryRoute = (app) => {
  app.get("/api/categories", getCategories);
  app.get("/api/categories/top", getTopCategories);
  app.get("/api/categories/:id", getCategoryById);
  app.post("/api/categories", Authorization, requirePermission("categories", "create"), createCategory);
  app.put("/api/categories/:id", Authorization, requirePermission("categories", "update"), updateCategory);
  app.patch("/api/categories/:id", Authorization, requirePermission("categories", "update"), updateCategory);
  app.delete("/api/categories/:id", Authorization, requirePermission("categories", "delete"), deleteCategory);
};

module.exports = CategoryRoute;
