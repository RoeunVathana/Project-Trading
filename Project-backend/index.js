require("dotenv").config();

const express = require("express");
const path = require("path"); // <-- Add this
const db = require("./models");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images statically at /image
app.use("/image", express.static(path.join(__dirname, "public/image")));

const ProductRoute = require("./routes/Product.route");
// Routes
ProductRoute(app);

// Sync database
db.sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Error syncing database:", err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
