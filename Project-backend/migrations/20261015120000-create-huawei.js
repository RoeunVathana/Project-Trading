"use strict";

const SCHEMA = "huawei_catalog";
const table = (tableName) => ({ tableName, schema: SCHEMA });
const reference = (tableName, key) => ({ model: table(tableName), key });

const timestamp = (Sequelize, allowNull = false) => ({
  type: Sequelize.DATE,
  allowNull,
  defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
});

async function createTableIfMissing(queryInterface, tableName, attributes) {
  const tableRef = table(tableName);
  if (!(await queryInterface.tableExists(tableRef))) {
    await queryInterface.createTable(tableRef, attributes);
  }
}

async function addIndexIfMissing(queryInterface, tableName, fields, name) {
  const indexes = await queryInterface.showIndex(table(tableName));
  if (!indexes.some((index) => index.name === name)) {
    await queryInterface.addIndex(table(tableName), fields, { name });
  }
}

async function addCheckIfMissing(queryInterface, Sequelize, tableName, name, expression) {
  const [rows] = await queryInterface.sequelize.query(
    `SELECT 1
       FROM pg_catalog.pg_constraint c
       JOIN pg_catalog.pg_namespace n ON n.oid = c.connamespace
      WHERE c.conname = :name AND n.nspname = :schemaName`,
    { replacements: { name, schemaName: SCHEMA } },
  );

  if (!rows.length) {
    await queryInterface.addConstraint(table(tableName), {
      type: "check",
      name,
      fields: [],
      where: Sequelize.literal(expression),
    });
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    if (queryInterface.sequelize.getDialect() !== "postgres") {
      throw new Error("The Huawei catalog requires PostgreSQL.");
    }

    const schemas = await queryInterface.showAllSchemas();
    if (!schemas.includes(SCHEMA)) await queryInterface.createSchema(SCHEMA);

    await createTableIfMissing(queryInterface, "category_huawei", {
      category_id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      parent_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: reference("category_huawei", "category_id"),
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      name: { type: Sequelize.STRING(150), allowNull: false },
      slug: { type: Sequelize.STRING(180), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: timestamp(Sequelize),
      updated_at: timestamp(Sequelize),
    });

    await createTableIfMissing(queryInterface, "huawei", {
      product_id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      category_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: reference("category_huawei", "category_id"),
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      brand_name: { type: Sequelize.STRING(100), allowNull: false, defaultValue: "Huawei" },
      model_code: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      product_name: { type: Sequelize.STRING(200), allowNull: false },
      slug: { type: Sequelize.STRING(220), allowNull: false, unique: true },
      short_description: { type: Sequelize.STRING(500), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: "PUBLISHED" },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: timestamp(Sequelize),
      updated_at: timestamp(Sequelize),
    });

    await createTableIfMissing(queryInterface, "product_images", {
      image_id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: reference("huawei", "product_id"),
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      image_url: { type: Sequelize.STRING(1000), allowNull: false },
      alt_text: { type: Sequelize.STRING(255), allowNull: true },
      is_primary: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: timestamp(Sequelize),
    });

    await createTableIfMissing(queryInterface, "product_specs", {
      spec_id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: reference("huawei", "product_id"),
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      spec_name: { type: Sequelize.STRING(150), allowNull: false },
      spec_value: { type: Sequelize.TEXT, allowNull: false },
      unit: { type: Sequelize.STRING(50), allowNull: true },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    });

    await createTableIfMissing(queryInterface, "product_documents", {
      document_id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: reference("huawei", "product_id"),
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      title: { type: Sequelize.STRING(200), allowNull: false },
      document_type: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "OTHER" },
      file_url: { type: Sequelize.STRING(1000), allowNull: false },
      language_code: { type: Sequelize.STRING(10), allowNull: false, defaultValue: "en" },
      published_at: { type: Sequelize.DATE, allowNull: true },
      created_at: timestamp(Sequelize),
    });

    await createTableIfMissing(queryInterface, "faqs", {
      faq_id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      question: { type: Sequelize.STRING(500), allowNull: false },
      answer: { type: Sequelize.TEXT, allowNull: false },
      is_published: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: timestamp(Sequelize),
    });

    await createTableIfMissing(queryInterface, "product_faqs", {
      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: reference("huawei", "product_id"),
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      faq_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: reference("faqs", "faq_id"),
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    });

    await createTableIfMissing(queryInterface, "comparison_groups", {
      comparison_id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING(200), allowNull: false },
      slug: { type: Sequelize.STRING(220), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      created_at: timestamp(Sequelize),
    });

    await createTableIfMissing(queryInterface, "comparison_items", {
      comparison_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: reference("comparison_groups", "comparison_id"),
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: reference("huawei", "product_id"),
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    });

    await createTableIfMissing(queryInterface, "site_pages", {
      page_id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      category_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: reference("category_huawei", "category_id"),
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      title: { type: Sequelize.STRING(200), allowNull: false },
      slug: { type: Sequelize.STRING(220), allowNull: false, unique: true },
      page_type: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "OTHER" },
      content: { type: Sequelize.TEXT, allowNull: true },
      is_published: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: timestamp(Sequelize),
      updated_at: timestamp(Sequelize),
    });

    await createTableIfMissing(queryInterface, "product_pdfs", {
      pdf_id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: reference("huawei", "product_id"),
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      title: { type: Sequelize.STRING(200), allowNull: false },
      original_file_name: { type: Sequelize.STRING(255), allowNull: false },
      stored_file_name: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      file_path: { type: Sequelize.STRING(1000), allowNull: false },
      file_size_bytes: { type: Sequelize.BIGINT, allowNull: false },
      mime_type: { type: Sequelize.STRING(100), allowNull: false, defaultValue: "application/pdf" },
      language_code: { type: Sequelize.STRING(10), allowNull: false, defaultValue: "en" },
      is_published: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      uploaded_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });

    await addIndexIfMissing(queryInterface, "category_huawei", ["parent_id"], "idx_huawei_category_parent");
    await addIndexIfMissing(queryInterface, "huawei", ["category_id", "status"], "idx_huawei_category_status");
    await addIndexIfMissing(queryInterface, "product_images", ["product_id", "display_order"], "idx_huawei_product_images_product");
    await addIndexIfMissing(queryInterface, "product_specs", ["product_id", "display_order"], "idx_huawei_product_specs_product");
    await addIndexIfMissing(queryInterface, "product_documents", ["product_id"], "idx_huawei_product_documents_product");
    await addIndexIfMissing(queryInterface, "faqs", ["is_published", "display_order"], "idx_huawei_faqs_published_order");
    await addIndexIfMissing(queryInterface, "comparison_items", ["product_id"], "idx_huawei_comparison_items_product");
    await addIndexIfMissing(queryInterface, "site_pages", ["category_id"], "idx_huawei_site_pages_category");
    await addIndexIfMissing(queryInterface, "product_pdfs", ["product_id"], "idx_huawei_product_pdfs_product");

    await addCheckIfMissing(queryInterface, Sequelize, "huawei", "chk_huawei_status", `"status" IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')`);
    await addCheckIfMissing(queryInterface, Sequelize, "product_documents", "chk_huawei_document_type", `"document_type" IN ('DATASHEET', 'USER_MANUAL', 'INSTALLATION_GUIDE', 'CERTIFICATE', 'OTHER')`);
    await addCheckIfMissing(queryInterface, Sequelize, "site_pages", "chk_huawei_page_type", `"page_type" IN ('MANAGEMENT_SYSTEM', 'DIGITAL_CHARACTERISTIC', 'PRODUCT_CONFIGURATION', 'OTHER')`);
    await addCheckIfMissing(queryInterface, Sequelize, "product_pdfs", "chk_huawei_pdf_size", '"file_size_bytes" >= 0');
    await addCheckIfMissing(queryInterface, Sequelize, "product_pdfs", "chk_huawei_pdf_mime", `"mime_type" = 'application/pdf'`);

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION "${SCHEMA}"."set_updated_at"()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trg_category_huawei_updated_at ON "${SCHEMA}"."category_huawei";
      CREATE TRIGGER trg_category_huawei_updated_at BEFORE UPDATE ON "${SCHEMA}"."category_huawei"
      FOR EACH ROW EXECUTE FUNCTION "${SCHEMA}"."set_updated_at"();
      DROP TRIGGER IF EXISTS trg_huawei_updated_at ON "${SCHEMA}"."huawei";
      CREATE TRIGGER trg_huawei_updated_at BEFORE UPDATE ON "${SCHEMA}"."huawei"
      FOR EACH ROW EXECUTE FUNCTION "${SCHEMA}"."set_updated_at"();
      DROP TRIGGER IF EXISTS trg_huawei_site_pages_updated_at ON "${SCHEMA}"."site_pages";
      CREATE TRIGGER trg_huawei_site_pages_updated_at BEFORE UPDATE ON "${SCHEMA}"."site_pages"
      FOR EACH ROW EXECUTE FUNCTION "${SCHEMA}"."set_updated_at"();
    `);
  },

  async down(queryInterface) {
    if (queryInterface.sequelize.getDialect() === "postgres") {
      await queryInterface.sequelize.query(`DROP SCHEMA IF EXISTS "${SCHEMA}" CASCADE`);
    }
  },
};
