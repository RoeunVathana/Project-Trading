const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/Category.controller");

const CategoryRoute = (app) => {
  app.get("/api/categories", getCategories);
  app.get("/api/categories/:id", getCategoryById);
  app.post("/api/categories", createCategory);
  app.put("/api/categories/:id", updateCategory);
  app.patch("/api/categories/:id", updateCategory);
  app.delete("/api/categories/:id", deleteCategory);
};

module.exports = CategoryRoute;
