"use strict";

const SCHEMA = "huawei_catalog";
const table = (name) => `"${SCHEMA}"."${name}"`;

const residentialChildren = [
  ["Product Comparison", "product-comparison", 13],
  ["Product Configuration", "product-configuration", 14],
  ["Frequently Asked Questions", "frequently-asked-questions", 15],
];

const upsertCategory = async (queryInterface, values, transaction) => {
  await queryInterface.sequelize.query(`
    INSERT INTO ${table("category_huawei")} (parent_id, name, slug, display_order, is_active)
    VALUES (:parentId, :name, :slug, :displayOrder, TRUE)
    ON CONFLICT (slug) DO UPDATE SET
      parent_id = EXCLUDED.parent_id,
      name = EXCLUDED.name,
      display_order = EXCLUDED.display_order,
      is_active = TRUE,
      updated_at = CURRENT_TIMESTAMP
  `, { replacements: values, transaction });
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const [roots] = await queryInterface.sequelize.query(`
        SELECT category_id AS id, slug
        FROM ${table("category_huawei")}
        WHERE slug IN ('residential', 'commercial-industrial')
      `, { transaction });
      const rootIds = new Map(roots.map((root) => [root.slug, root.id]));
      const residentialId = rootIds.get("residential");
      const commercialIndustrialId = rootIds.get("commercial-industrial");

      if (!residentialId || !commercialIndustrialId) {
        throw new Error("Huawei Residential and Commercial & Industrial categories are required.");
      }

      // The current catalog products belong to the Residential family in the
      // requested navigation layout. Preserve every existing child record.
      await queryInterface.sequelize.query(`
        UPDATE ${table("category_huawei")}
        SET parent_id = :residentialId,
            updated_at = CURRENT_TIMESTAMP
        WHERE parent_id = :commercialIndustrialId
      `, {
        replacements: { residentialId, commercialIndustrialId },
        transaction,
      });

      for (const [name, slug, displayOrder] of residentialChildren) {
        await upsertCategory(queryInterface, {
          parentId: residentialId,
          name,
          slug,
          displayOrder,
        }, transaction);
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(`
        DELETE FROM ${table("category_huawei")} category
        WHERE category.slug IN (:slugs)
          AND NOT EXISTS (
            SELECT 1
            FROM ${table("huawei")} product
            WHERE product.category_id = category.category_id
          )
      `, {
        replacements: { slugs: residentialChildren.map(([, slug]) => slug) },
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
