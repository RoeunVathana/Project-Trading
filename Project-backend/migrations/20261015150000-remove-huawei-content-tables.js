"use strict";

const SCHEMA = "huawei_catalog";
const ref = (tableName) => ({ tableName, schema: SCHEMA });
const exists = (queryInterface, tableName) => queryInterface.tableExists(ref(tableName));

module.exports = {
  async up(queryInterface) {
    for (const tableName of [
      "product_faqs",
      "comparison_items",
      "product_specs",
      "product_documents",
      "faqs",
      "comparison_groups",
      "site_pages",
    ]) {
      if (await exists(queryInterface, tableName)) await queryInterface.dropTable(ref(tableName));
    }
  },

  async down(queryInterface, Sequelize) {
    const [schemas] = await queryInterface.sequelize.query(
      "SELECT 1 FROM pg_namespace WHERE nspname = :schema",
      { replacements: { schema: SCHEMA } },
    );
    if (!schemas.length) await queryInterface.createSchema(SCHEMA);

    const create = async (tableName, attributes) => {
      if (!(await exists(queryInterface, tableName))) await queryInterface.createTable(ref(tableName), attributes);
    };
    const timestamp = { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") };
    const product = { model: ref("huawei"), key: "product_id" };
    const category = { model: ref("category_huawei"), key: "category_id" };

    await create("product_specs", {
      spec_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      product_id: { type: Sequelize.BIGINT, allowNull: false, references: product, onDelete: "CASCADE", onUpdate: "CASCADE" },
      spec_name: { type: Sequelize.STRING(150), allowNull: false },
      spec_value: { type: Sequelize.TEXT, allowNull: false },
      unit: { type: Sequelize.STRING(50), allowNull: true },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    });
    await create("product_documents", {
      document_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      product_id: { type: Sequelize.BIGINT, allowNull: false, references: product, onDelete: "CASCADE", onUpdate: "CASCADE" },
      title: { type: Sequelize.STRING(200), allowNull: false },
      document_type: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "OTHER" },
      file_url: { type: Sequelize.STRING(1000), allowNull: false },
      language_code: { type: Sequelize.STRING(10), allowNull: false, defaultValue: "en" },
      published_at: { type: Sequelize.DATE, allowNull: true },
      created_at: timestamp,
    });
    await create("faqs", {
      faq_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      question: { type: Sequelize.STRING(500), allowNull: false },
      answer: { type: Sequelize.TEXT, allowNull: false },
      is_published: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: timestamp,
    });
    await create("product_faqs", {
      product_id: { type: Sequelize.BIGINT, allowNull: false, primaryKey: true, references: product, onDelete: "CASCADE", onUpdate: "CASCADE" },
      faq_id: { type: Sequelize.BIGINT, allowNull: false, primaryKey: true, references: { model: ref("faqs"), key: "faq_id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    });
    await create("comparison_groups", {
      comparison_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING(200), allowNull: false },
      slug: { type: Sequelize.STRING(220), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      created_at: timestamp,
    });
    await create("comparison_items", {
      comparison_id: { type: Sequelize.BIGINT, allowNull: false, primaryKey: true, references: { model: ref("comparison_groups"), key: "comparison_id" }, onDelete: "CASCADE", onUpdate: "CASCADE" },
      product_id: { type: Sequelize.BIGINT, allowNull: false, primaryKey: true, references: product, onDelete: "CASCADE", onUpdate: "CASCADE" },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    });
    await create("site_pages", {
      page_id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      category_id: { type: Sequelize.BIGINT, allowNull: true, references: category, onDelete: "SET NULL", onUpdate: "CASCADE" },
      title: { type: Sequelize.STRING(200), allowNull: false },
      slug: { type: Sequelize.STRING(220), allowNull: false, unique: true },
      page_type: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "OTHER" },
      content: { type: Sequelize.TEXT, allowNull: true },
      is_published: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: timestamp,
      updated_at: timestamp,
    });
  },
};
