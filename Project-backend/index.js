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
app.use("/video", express.static(path.join(__dirname, "Public/video")));
app.use("/pdf", express.static(path.join(__dirname, "Public/pdf")));

const ProductRoute = require("./routes/Product.route");
const CategoryRoute = require("./routes/Category.route");
const MachineRoute = require("./routes/Machine.route");
const MachineGalleryRoute = require("./routes/MachineGallery.route");
const MachineSpecRoute = require("./routes/MachineSpec.route");
const MachinePdfRoute = require("./routes/MachinePdf.route");
const UserRoute = require("./routes/User.route");
// Routes
ProductRoute(app);
CategoryRoute(app);
MachineRoute(app);
MachineGalleryRoute(app);
MachineSpecRoute(app);
MachinePdfRoute(app);
UserRoute(app);

// Sync database
db.sequelize
  .sync()
  .then(async () => {
    const queryInterface = db.sequelize.getQueryInterface();
    const usersTable = await queryInterface.describeTable("Users");
    if (!usersTable.profileImage) {
      await queryInterface.addColumn("Users", "profileImage", {
        type: db.Sequelize.STRING(500),
        allowNull: true,
      });
    }
    const machinesTable = await queryInterface.describeTable("machines");
    if (!machinesTable.viewCount) {
      await queryInterface.addColumn("machines", "viewCount", {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    }
    if (!machinesTable.video) {
      await queryInterface.addColumn("machines", "video", {
        type: db.Sequelize.STRING(500),
        allowNull: true,
      });
    }
    const specsTable = await queryInterface.describeTable("machine_specs");
    const specificationColumns = [
      "frameVariation",
      "ratedCurrent",
      "voltage",
      "icuIcs",
      "poles",
      "mounting",
      "tripUnit",
    ];
    for (const column of specificationColumns) {
      if (!specsTable[column]) {
        await queryInterface.addColumn("machine_specs", column, {
          type: db.Sequelize.STRING,
          allowNull: true,
        });
      }
    }
    if (specsTable.specName && specsTable.specName.allowNull === false) {
      await queryInterface.changeColumn("machine_specs", "specName", {
        type: db.Sequelize.STRING,
        allowNull: true,
      });
    }
    if (specsTable.specValue && specsTable.specValue.allowNull === false) {
      await queryInterface.changeColumn("machine_specs", "specValue", {
        type: db.Sequelize.STRING,
        allowNull: true,
      });
    }
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => logError("DatabaseSync", error));
