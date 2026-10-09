const {
  getCategories,
  getTopCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/Category.controller");
const Authorization = require("../middlewares/Authorization");

const CategoryRoute = (app) => {
  app.get("/api/categories", getCategories);
  app.get("/api/categories/top", getTopCategories);
  app.get("/api/categories/:id", getCategoryById);
  app.post("/api/categories", Authorization, createCategory);
  app.put("/api/categories/:id", Authorization, updateCategory);
  app.patch("/api/categories/:id", Authorization, updateCategory);
  app.delete("/api/categories/:id", Authorization, deleteCategory);
};

module.exports = CategoryRoute;
