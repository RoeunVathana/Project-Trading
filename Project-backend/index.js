require("dotenv").config({ quiet: true });

const express = require("express");
const path = require("path"); // <-- Add this
const db = require("./models");
const cors = require("cors");
const { logError } = require("./middlewares/LogError");

const app = express();
const PORT = process.env.PORT || 3000;
const corsOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === "production" && !process.env.TOKEN_SECRET) {
  throw new Error("TOKEN_SECRET must be configured in production.");
}

// Middleware
app.use(cors({ origin: corsOrigins.length ? corsOrigins : true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public catalog GETs are safe to reuse briefly between page navigations.
// Authenticated dashboard requests stay uncached so permission/profile changes
// are reflected immediately.
app.use("/api", (req, res, next) => {
  const isPublicCatalogRequest = !req.path.startsWith("/users");
  if (req.method === "GET" && isPublicCatalogRequest && !req.get("authorization")) {
    res.set("Cache-Control", "public, max-age=15, stale-while-revalidate=30");
  } else {
    res.set("Cache-Control", "no-store");
  }
  next();
});

// Uploaded media uses unique filenames, so cache it aggressively between visits.
const mediaStaticOptions = {
  maxAge: "30d",
  etag: true,
  lastModified: true,
};
app.use("/image", express.static(path.join(__dirname, "Public/image"), mediaStaticOptions));
app.use("/video", express.static(path.join(__dirname, "Public/video"), mediaStaticOptions));
app.use("/pdf", express.static(path.join(__dirname, "Public/pdf"), mediaStaticOptions));

const ProductRoute = require("./routes/Product.route");
const CategoryRoute = require("./routes/Category.route");
const MachineRoute = require("./routes/Machine.route");
const MachineGalleryRoute = require("./routes/MachineGallery.route");
const MachineSpecRoute = require("./routes/MachineSpec.route");
const MachinePdfRoute = require("./routes/MachinePdf.route");
const UserRoute = require("./routes/User.route");
const HuaweiRoute = require("./routes/Huawei.route");
const HuaweiCategoryRoute = require("./routes/HuaweiCategory.route");
const HuaweiCatalogRoute = require("./routes/HuaweiCatalog.route");
// Routes
ProductRoute(app);
CategoryRoute(app);
MachineRoute(app);
MachineGalleryRoute(app);
MachineSpecRoute(app);
MachinePdfRoute(app);
UserRoute(app);
HuaweiRoute(app);
HuaweiCategoryRoute(app);
HuaweiCatalogRoute(app);

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
    if (!usersTable.role) {
      await queryInterface.addColumn("Users", "role", {
        type: db.Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "staff",
      });
      const usersTableName = queryInterface.quoteTable("Users");
      const roleColumn = queryInterface.quoteIdentifier("role");
      const usernameColumn = queryInterface.quoteIdentifier("username");
      const idColumn = queryInterface.quoteIdentifier("id");
      await db.sequelize.query(
        `UPDATE ${usersTableName} SET ${roleColumn} = 'admin' WHERE LOWER(${usernameColumn}) = 'admin'`,
      );
      const [admins] = await db.sequelize.query(
        `SELECT ${idColumn} FROM ${usersTableName} WHERE ${roleColumn} = 'admin' LIMIT 1`,
      );
      if (!admins.length) {
        await db.sequelize.query(
          `UPDATE ${usersTableName} SET ${roleColumn} = 'admin' WHERE ${idColumn} = (SELECT ${idColumn} FROM ${usersTableName} ORDER BY ${idColumn} ASC LIMIT 1)`,
        );
      }
    }
    if (!usersTable.permissions) {
      await queryInterface.addColumn("Users", "permissions", {
        type: db.Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
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
    if (!machinesTable.description) {
      await queryInterface.addColumn("machines", "description", {
        type: db.Sequelize.TEXT,
        allowNull: true,
      });
    }
    const specsTable = await queryInterface.describeTable("machine_specs");
    const specificationContentColumns = {
      section: {
        type: db.Sequelize.STRING(160),
        allowNull: true,
      },
      label: {
        type: db.Sequelize.STRING(160),
        allowNull: true,
      },
      value: {
        type: db.Sequelize.TEXT,
        allowNull: true,
      },
      sortOrder: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    };
    for (const [column, definition] of Object.entries(specificationContentColumns)) {
      if (!specsTable[column]) {
        await queryInterface.addColumn("machine_specs", column, definition);
      }
    }
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
