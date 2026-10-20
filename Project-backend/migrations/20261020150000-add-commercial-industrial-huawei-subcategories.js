"use strict";

const SCHEMA = "huawei_catalog";
const table = (name) => `"${SCHEMA}"."${name}"`;

const commercialIndustrialChildren = [
  ["Smart Module Controller", "commercial-industrial-smart-module-controller", 1],
  ["Smart PV Controller", "commercial-industrial-smart-pv-controller", 2],
  ["C&I Hybrid Cooling Grid Forming ESS", "commercial-industrial-c-and-i-hybrid-cooling-grid-forming-ess", 3],
  ["Accessories", "commercial-industrial-accessories", 4],
  ["Management System", "commercial-industrial-management-system", 5],
  ["Digital Characteristic", "commercial-industrial-digital-characteristic", 6],
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
        WHERE slug IN ('commercial-industrial', 'commercial-and-industrial')
        ORDER BY CASE WHEN slug = 'commercial-industrial' THEN 0 ELSE 1 END
      `, { transaction });

      const canonicalRoot = roots.find((root) => root.slug === "commercial-industrial") || roots[0];
      if (!canonicalRoot) {
        throw new Error("Commercial & Industrial Huawei category is required.");
      }

      const duplicateRoot = roots.find((root) => root.id !== canonicalRoot.id);
      if (duplicateRoot) {
        await queryInterface.sequelize.query(`
          UPDATE ${table("category_huawei")}
          SET parent_id = :canonicalRootId,
              updated_at = CURRENT_TIMESTAMP
          WHERE parent_id = :duplicateRootId
        `, {
          replacements: {
            canonicalRootId: canonicalRoot.id,
            duplicateRootId: duplicateRoot.id,
          },
          transaction,
        });

        await queryInterface.sequelize.query(`
          UPDATE ${table("huawei")}
          SET category_id = :canonicalRootId,
              category_ids = array_replace(category_ids, :duplicateRootId, :canonicalRootId),
              updated_at = CURRENT_TIMESTAMP
          WHERE category_id = :duplicateRootId
             OR :duplicateRootId = ANY(category_ids)
        `, {
          replacements: {
            canonicalRootId: canonicalRoot.id,
            duplicateRootId: duplicateRoot.id,
          },
          transaction,
        });

        await queryInterface.sequelize.query(`
          UPDATE ${table("category_huawei")}
          SET is_active = FALSE,
              updated_at = CURRENT_TIMESTAMP
          WHERE category_id = :duplicateRootId
        `, {
          replacements: { duplicateRootId: duplicateRoot.id },
          transaction,
        });
      }

      for (const [name, slug, displayOrder] of commercialIndustrialChildren) {
        await upsertCategory(queryInterface, {
          parentId: canonicalRoot.id,
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
               OR category.category_id = ANY(product.category_ids)
          )
      `, {
        replacements: { slugs: commercialIndustrialChildren.map(([, slug]) => slug) },
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
