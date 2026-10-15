"use strict";

const path = require("path");
const bcrypt = require("bcryptjs");

const categoriesToSeed = [
  {
    name: "Milling Centers",
    description: "High-precision CNC milling machines for industrial production.",
    status: "active",
  },
  {
    name: "Turning Centers",
    description: "Reliable CNC turning solutions for demanding applications.",
    status: "active",
  },
  {
    name: "Power Distribution",
    description: "Low-voltage equipment for safe and efficient power distribution.",
    status: "active",
  },
];

const machinesToSeed = [
  {
    name: "Precision Pro 5K",
    model: "EFS-CNC-5000",
    category: "Milling Centers",
    description: "A high-speed five-axis milling center for precision production.",
    machineType: "Milling center",
    power: "35 kW",
    precision: "0.001 mm",
    availability: "In stock",
    badge: "Featured",
    viewCount: 0,
  },
  {
    name: "TurnMaster 2K",
    model: "TM-CNC-2000",
    category: "Turning Centers",
    description: "A compact CNC turning center for repeatable production work.",
    machineType: "Turning center",
    power: "22 kW",
    precision: "0.002 mm",
    availability: "Ready to order",
    badge: "New",
    viewCount: 0,
  },
  {
    name: "Smart Power Breaker",
    model: "EFS-LV-6300",
    category: "Power Distribution",
    description: "A configurable low-voltage breaker for industrial distribution systems.",
    machineType: "Low-voltage breaker",
    power: "6300 A",
    precision: "IEC/EN 60947-2",
    availability: "In stock",
    badge: "",
    viewCount: 0,
  },
];

const specificationsByModel = {
  "EFS-CNC-5000": [
    { section: "compliant standards", label: "", value: "IEC 60947-1", sortOrder: 0 },
    { section: "compliant standards", label: "", value: "IEC 60947-2", sortOrder: 1 },
    { section: "compliant standards", label: "", value: "IEC 60947-3", sortOrder: 2 },
    { section: "compliant standards", label: "", value: "IEC 60947-4-1", sortOrder: 3 },
    { section: "electrical characteristics", label: "Frame size (A)", value: "125, 250, 400, 630, 800, 1600", sortOrder: 10 },
    { section: "electrical characteristics", label: "Rated current range (A)", value: "16–1600", sortOrder: 11 },
    { section: "electrical characteristics", label: "Rated voltage (VAC/VDC)", value: "AC up to 690V, DC up to 1000V", sortOrder: 12 },
    { section: "electrical characteristics", label: "Poles", value: "1P, 2P, 3P, 4P, 4C", sortOrder: 13 },
    { section: "electrical characteristics", label: "Breaking capacity code", value: "B, C, S, Q, H, R", sortOrder: 14 },
    { section: "electrical characteristics", label: "Release types", value: "TM (thermal-magnetic), EN (basic electronic), EM (standard electronic), M (magnetic), ENM (basic electronic motor), EMM (standard electronic motor), Blank (switch disconnector)", sortOrder: 15 },
    { section: "installation", label: "Installation", value: "vertical/horizontal, top/bottom line entry", sortOrder: 20 },
  ],
  "TM-CNC-2000": [
    { section: "compliant standards", label: "", value: "ISO 230-2", sortOrder: 0 },
    { section: "machine characteristics", label: "Maximum turning diameter", value: "450 mm", sortOrder: 10 },
    { section: "machine characteristics", label: "Spindle speed", value: "6000 RPM", sortOrder: 11 },
    { section: "mounting", label: "Installation method", value: "Floor mounted", sortOrder: 20 },
  ],
  "EFS-LV-6300": [
    { section: "compliant standards", label: "", value: "IEC/EN 60947-2", sortOrder: 0 },
    { section: "electrical characteristics", label: "Rated current (In)", value: "630A–6300A", sortOrder: 10 },
    { section: "electrical characteristics", label: "Breaking capacity", value: "Up to 120 kA", sortOrder: 11 },
    { section: "mounting", label: "Installation method", value: "Draw-out type, fixed type", sortOrder: 20 },
  ],
};

const toPublicMediaPath = (value, folder) => {
  if (!value) return null;
  const normalized = String(value).trim().replace(/\\/g, "/");
  const publicPath = normalized.match(new RegExp(`(?:^|/)Public/${folder}/(.+)$`, "i"));
  if (publicPath) return `/${folder}/${publicPath[1]}`;
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

const getSeedMachineMedia = () => ({
  image: toPublicMediaPath(process.env.SEED_IMAGE_PATH, "image"),
  video: toPublicMediaPath(process.env.SEED_VIDEO_PATH, "video"),
  pdf: toPublicMediaPath(process.env.SEED_PDF_PATH, "pdf"),
});

const selectRows = (queryInterface, Sequelize, tableName, transaction) =>
  queryInterface.sequelize.query(`SELECT * FROM "${tableName}"`, {
    type: Sequelize.QueryTypes.SELECT,
    transaction,
  });

const insertMissing = async (queryInterface, Sequelize, tableName, rows, key, transaction) => {
  if (!rows.length) return 0;

  const existing = await selectRows(queryInterface, Sequelize, tableName, transaction);
  const existingKeys = new Set(existing.map((row) => key(row)));
  const missing = rows.filter((row) => !existingKeys.has(key(row)));

  if (missing.length) {
    await queryInterface.bulkInsert(tableName, missing, { transaction });
  }
  return missing.length;
};

const getMachineIds = async (queryInterface, Sequelize, transaction) => {
  const machines = await selectRows(queryInterface, Sequelize, "machines", transaction);
  return new Map(machines.map((machine) => [machine.model, machine]));
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    const now = new Date();
    const media = getSeedMachineMedia();
    let counts = { categories: 0, machines: 0, specifications: 0, users: 0, gallery: 0, pdfs: 0 };

    try {
      counts.categories = await insertMissing(
        queryInterface,
        Sequelize,
        "categories",
        categoriesToSeed.map((category) => ({ ...category, createdAt: now, updatedAt: now })),
        (row) => row.name.toLowerCase(),
        transaction,
      );

      const categories = await selectRows(queryInterface, Sequelize, "categories", transaction);
      const categoryIds = new Map(categories.map((category) => [category.name.toLowerCase(), category.id]));
      const machineRows = machinesToSeed.map((machine) => ({
        name: machine.name,
        model: machine.model,
        description: machine.description,
        categoryId: categoryIds.get(machine.category.toLowerCase()),
        image: media.image,
        video: media.video,
        badge: machine.badge,
        machineType: machine.machineType,
        power: machine.power,
        precision: machine.precision,
        availability: machine.availability,
        viewCount: machine.viewCount,
        createdAt: now,
        updatedAt: now,
      }));

      counts.machines = await insertMissing(
        queryInterface,
        Sequelize,
        "machines",
        machineRows,
        (row) => row.model.toLowerCase(),
        transaction,
      );

      const machines = await getMachineIds(queryInterface, Sequelize, transaction);
      const forceMediaUpdate = process.env.SEED_FORCE_MEDIA === "true";
      for (const machine of machinesToSeed) {
        const existingMachine = machines.get(machine.model);
        if (!existingMachine) continue;

        const mediaUpdates = {};
        if (media.image && (forceMediaUpdate || !existingMachine.image)) mediaUpdates.image = media.image;
        if (media.video && (forceMediaUpdate || !existingMachine.video)) mediaUpdates.video = media.video;
        if (Object.keys(mediaUpdates).length) {
          mediaUpdates.updatedAt = now;
          await queryInterface.bulkUpdate("machines", mediaUpdates, { id: existingMachine.id }, { transaction });
        }
      }

      const existingSpecifications = await selectRows(queryInterface, Sequelize, "machine_specs", transaction);
      const specificationRows = [];

      for (const [model, specs] of Object.entries(specificationsByModel)) {
        const machine = machines.get(model);
        if (!machine) continue;

        for (const spec of specs) {
          const duplicate = existingSpecifications.some((existing) =>
            Number(existing.machineId) === Number(machine.id) &&
            String(existing.section || "").toLowerCase() === spec.section &&
            String(existing.label || "").toLowerCase() === spec.label &&
            String(existing.value || "") === spec.value,
          );
          if (!duplicate) {
            specificationRows.push({
              machineId: machine.id,
              section: spec.section,
              label: spec.label || null,
              value: spec.value,
              sortOrder: spec.sortOrder,
              specName: spec.label || spec.section,
              specValue: spec.value,
              createdAt: now,
              updatedAt: now,
            });
          }
        }
      }

      if (specificationRows.length) {
        await queryInterface.bulkInsert("machine_specs", specificationRows, { transaction });
      }
      counts.specifications = specificationRows.length;

      if (process.env.SEED_ADMIN_PASSWORD) {
        const existingUsers = await selectRows(queryInterface, Sequelize, "Users", transaction);
        const adminEmail = "admin@example.com";
        if (!existingUsers.some((user) => user.email.toLowerCase() === adminEmail)) {
          await queryInterface.bulkInsert("Users", [{
            username: "admin",
            email: adminEmail,
            password: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12),
            profileImage: null,
            createdAt: now,
            updatedAt: now,
          }], { transaction });
          counts.users = 1;
        }
      }

      const firstMachine = machines.get(machinesToSeed[0].model);
      if (firstMachine && media.image) {
        const existingGallery = await selectRows(queryInterface, Sequelize, "machine_galleries", transaction);
        if (!existingGallery.some((item) => item.machineId === firstMachine.id && item.imageUrl === media.image)) {
          await queryInterface.bulkInsert("machine_galleries", [{
            machineId: firstMachine.id,
            imageUrl: media.image,
            sortOrder: 0,
            createdAt: now,
            updatedAt: now,
          }], { transaction });
          counts.gallery = 1;
        }
      }

      if (firstMachine && media.pdf) {
        const existingPdfs = await selectRows(queryInterface, Sequelize, "machine_pdfs", transaction);
        if (!existingPdfs.some((pdf) => pdf.machineId === firstMachine.id && pdf.filePath === media.pdf)) {
          await queryInterface.bulkInsert("machine_pdfs", [{
            machineId: firstMachine.id,
            fileName: path.basename(media.pdf),
            filePath: media.pdf,
            fileSize: null,
            createdAt: now,
            updatedAt: now,
          }], { transaction });
          counts.pdfs = 1;
        }
      }

      await transaction.commit();
      console.log("Demo catalog seed complete:", counts);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const models = machinesToSeed.map((machine) => machine.model);
      const machines = await selectRows(queryInterface, Sequelize, "machines", transaction);
      const machineIds = machines
        .filter((machine) => models.includes(machine.model))
        .map((machine) => machine.id);

      if (machineIds.length) {
        await queryInterface.bulkDelete("machine_specs", { machineId: { [Sequelize.Op.in]: machineIds } }, { transaction });
        await queryInterface.bulkDelete("machine_galleries", { machineId: { [Sequelize.Op.in]: machineIds } }, { transaction });
        await queryInterface.bulkDelete("machine_pdfs", { machineId: { [Sequelize.Op.in]: machineIds } }, { transaction });
        await queryInterface.bulkDelete("machines", { id: { [Sequelize.Op.in]: machineIds } }, { transaction });
      }

      await queryInterface.bulkDelete("categories", {
        name: { [Sequelize.Op.in]: categoriesToSeed.map((category) => category.name) },
      }, { transaction });

      if (process.env.SEED_ADMIN_PASSWORD) {
        await queryInterface.bulkDelete("Users", { email: "admin@example.com" }, { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
