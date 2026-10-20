"use strict";

const SCHEMA = "huawei_catalog";
const table = (name) => `"${SCHEMA}"."${name}"`;

const roots = [
  ["Residential", "residential", 1],
  ["Commercial & Industrial", "commercial-industrial", 2],
  ["Utility Scale", "utility-scale", 3],
  ["Smart String Grid Forming ESS", "smart-string-grid-forming-ess", 4],
  ["Smart Microgrid", "smart-microgrid", 5],
];

const commercialChildren = [
  ["Smart Module Controller", "smart-module-controller", 1],
  ["Smart PV Controller", "smart-pv-controller", 2],
  ["Smart Energy Controller", "smart-energy-controller", 3],
  ["C&I Hybrid Cooling Grid Forming ESS", "c-and-i-hybrid-cooling-grid-forming-ess", 4],
  ["Smart String ESS", "smart-string-ess", 5],
  ["Smart Charger", "smart-charger", 6],
  ["Smart Guard", "smart-guard", 7],
  ["SmartAssistant", "smartassistant", 8],
  ["Accessories", "accessories", 9],
  ["Solar Inverter", "solar-inverter", 10],
  ["Management System", "management-system", 11],
  ["Digital Characteristic", "digital-characteristic", 12],
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

  const [rows] = await queryInterface.sequelize.query(`
    SELECT category_id AS id
    FROM ${table("category_huawei")}
    WHERE slug = :slug
  `, { replacements: { slug: values.slug }, transaction });

  return rows[0].id;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const rootIds = {};
      for (const [name, slug, displayOrder] of roots) {
        rootIds[slug] = await upsertCategory(queryInterface, {
          parentId: null,
          name,
          slug,
          displayOrder,
        }, transaction);
      }

      const residentialId = rootIds.residential;
      const commercialIndustrialId = rootIds["commercial-industrial"];

      // Preserve every existing child category, including categories created
      // from the dashboard, while placing them under the new C&I family.
      await queryInterface.sequelize.query(`
        UPDATE ${table("category_huawei")}
        SET parent_id = :commercialIndustrialId,
            updated_at = CURRENT_TIMESTAMP
        WHERE parent_id = :residentialId
      `, {
        replacements: { residentialId, commercialIndustrialId },
        transaction,
      });

      for (const [name, slug, displayOrder] of commercialChildren) {
        await upsertCategory(queryInterface, {
          parentId: commercialIndustrialId,
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
      const [residentialRows] = await queryInterface.sequelize.query(`
        SELECT category_id AS id
        FROM ${table("category_huawei")}
        WHERE slug = 'residential'
      `, { transaction });
      const residentialId = residentialRows[0]?.id;

      if (residentialId) {
        await queryInterface.sequelize.query(`
          UPDATE ${table("category_huawei")}
          SET parent_id = :residentialId,
              updated_at = CURRENT_TIMESTAMP
          WHERE parent_id = (
            SELECT category_id
            FROM ${table("category_huawei")}
            WHERE slug = 'commercial-industrial'
          )
            AND category_id <> :residentialId
        `, {
          replacements: { residentialId },
          transaction,
        });
      }

      await queryInterface.sequelize.query(`
        DELETE FROM ${table("category_huawei")} category
        WHERE category.slug IN (:slugs)
          AND NOT EXISTS (
            SELECT 1
            FROM ${table("huawei")} product
            WHERE product.category_id = category.category_id
          )
          AND NOT EXISTS (
            SELECT 1
            FROM ${table("category_huawei")} child
            WHERE child.parent_id = category.category_id
          )
      `, {
        replacements: {
          slugs: roots.filter(([, slug]) => slug !== "residential").map(([, slug]) => slug),
        },
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
