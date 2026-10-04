require("dotenv").config();

const express = require("express");
const path = require("path"); // <-- Add this
const db = require("./models");
const cors = require("cors");
const { logError } = require("./middlewares/LogError");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images statically at /image
app.use("/image", express.static(path.join(__dirname, "Public/image")));
app.use("/pdf", express.static(path.join(__dirname, "Public/pdf")));

const ProductRoute = require("./routes/Product.route");
const CategoryRoute = require("./routes/Category.route");
const MachineRoute = require("./routes/Machine.route");
const MachineGalleryRoute = require("./routes/MachineGallery.route");
const MachineSpecRoute = require("./routes/MachineSpec.route");
const MachinePdfRoute = require("./routes/MachinePdf.route");
// Routes
ProductRoute(app);
CategoryRoute(app);
MachineRoute(app);
MachineGalleryRoute(app);
MachineSpecRoute(app);
MachinePdfRoute(app);

// Sync database
db.sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((error) => logError("DatabaseSync", error));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
