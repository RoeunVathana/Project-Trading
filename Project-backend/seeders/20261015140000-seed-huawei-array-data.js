"use strict";

const SCHEMA = "huawei_catalog";
const table = (name) => `"${SCHEMA}"."${name}"`;

const childCategories = [
  ["Smart Module Controller", "smart-module-controller", 1],
  ["Smart Energy Controller", "smart-energy-controller", 2],
  ["Smart String ESS", "smart-string-ess", 3],
  ["Smart Charger", "smart-charger", 4],
  ["Smart Guard", "smart-guard", 5],
  ["SmartAssistant", "smartassistant", 6],
  ["Accessories", "accessories", 7],
  ["Solar Inverter", "solar-inverter", 8],
];

const products = [
  {
    categorySlug: "smart-module-controller",
    modelCode: "SUN2000-600W-PA0",
    productName: "SUN2000-600W-PA0",
    slug: "sun2000-600w-pa0",
    shortDescription: "Smart Module Controller",
    status: "PUBLISHED",
    displayOrder: 1,
    imageUrl: "/images/sun2000-600w-pa0.png",
  },
  {
    categorySlug: "smart-module-controller",
    modelCode: "SUN2000-450W-P2/600W-P",
    productName: "SUN2000-450W-P2/600W-P",
    slug: "sun2000-450w-p2-600w-p",
    shortDescription: "Smart Module Controller",
    status: "PUBLISHED",
    displayOrder: 2,
    imageUrl: "/images/sun2000-450w-p2-600w-p.png",
  },
  {
    categorySlug: "smart-energy-controller",
    modelCode: "SUN5000 Series",
    productName: "SUN5000 Series",
    slug: "sun5000-series",
    shortDescription: "Smart Energy Controller",
    status: "PUBLISHED",
    displayOrder: 1,
    imageUrl: "/images/sun5000-series.png",
  },
  {
    categorySlug: "smart-module-controller",
    modelCode: "DEMO-SMC-001",
    productName: "Demo Smart Module Controller",
    slug: "demo-smart-module-controller",
    shortDescription: "Example product for database testing",
    status: "DRAFT",
    displayOrder: 99,
    imageUrl: "/images/demo-smart-module-controller.png",
  },
];

const queryRows = async (queryInterface, sql, replacements, transaction) => {
  const [rows] = await queryInterface.sequelize.query(sql, { replacements, transaction });
  return rows;
};

const upsertCategory = async (queryInterface, values, transaction) => {
  const rows = await queryRows(queryInterface, `
    INSERT INTO ${table("category_huawei")} (parent_id, name, slug, display_order)
    VALUES (:parentId, :name, :slug, :displayOrder)
    ON CONFLICT (slug) DO UPDATE SET
      parent_id = EXCLUDED.parent_id,
      name = EXCLUDED.name,
      display_order = EXCLUDED.display_order
    RETURNING category_id
  `, values, transaction);
  return rows[0].category_id;
};

const upsertProduct = async (queryInterface, values, transaction) => {
  const rows = await queryRows(queryInterface, `
    INSERT INTO ${table("huawei")} (
      category_id, brand_name, model_code, product_name, slug,
      short_description, status, display_order
    ) VALUES (
      :categoryId, 'Huawei', :modelCode, :productName, :slug,
      :shortDescription, :status, :displayOrder
    )
    ON CONFLICT (model_code) DO UPDATE SET
      category_id = EXCLUDED.category_id,
      brand_name = EXCLUDED.brand_name,
      product_name = EXCLUDED.product_name,
      slug = EXCLUDED.slug,
      short_description = EXCLUDED.short_description,
      status = EXCLUDED.status,
      display_order = EXCLUDED.display_order
    RETURNING product_id
  `, values, transaction);
  return rows[0].product_id;
};

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const rootId = await upsertCategory(queryInterface, {
        parentId: null,
        name: "Residential",
        slug: "residential",
        displayOrder: 1,
      }, transaction);

      const categoryIds = {};
      for (const [name, slug, displayOrder] of childCategories) {
        categoryIds[slug] = await upsertCategory(queryInterface, {
          parentId: rootId,
          name,
          slug,
          displayOrder,
        }, transaction);
      }

      for (const product of products) {
        const productId = await upsertProduct(queryInterface, {
          categoryId: categoryIds[product.categorySlug],
          modelCode: product.modelCode,
          productName: product.productName,
          slug: product.slug,
          shortDescription: product.shortDescription,
          status: product.status,
          displayOrder: product.displayOrder,
        }, transaction);

        await queryInterface.sequelize.query(`
          INSERT INTO ${table("product_images")} (product_id, image_url, alt_text, is_primary, display_order)
          SELECT :productId, :imageUrl, :altText, TRUE, 1
          WHERE NOT EXISTS (
            SELECT 1 FROM ${table("product_images")}
            WHERE product_id = :productId AND image_url = :imageUrl
          )
        `, {
          replacements: {
            productId,
            imageUrl: product.imageUrl,
            altText: product.productName,
          },
          transaction,
        });
      }

      await transaction.commit();
      console.log("Huawei array seed complete.");
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(`
        DELETE FROM ${table("product_images")}
        WHERE image_url IN (:imageUrls)
      `, {
        replacements: { imageUrls: products.map((product) => product.imageUrl) },
        transaction,
      });

      await queryInterface.sequelize.query(`
        DELETE FROM ${table("huawei")}
        WHERE model_code IN (:modelCodes)
      `, {
        replacements: { modelCodes: products.map((product) => product.modelCode) },
        transaction,
      });

      await queryInterface.sequelize.query(`
        DELETE FROM ${table("category_huawei")} child
        WHERE child.slug IN (:childSlugs)
          AND NOT EXISTS (
            SELECT 1 FROM ${table("huawei")} product WHERE product.category_id = child.category_id
          )
      `, {
        replacements: { childSlugs: childCategories.map(([, slug]) => slug) },
        transaction,
      });

      await queryInterface.sequelize.query(`
        DELETE FROM ${table("category_huawei")} root
        WHERE root.slug = 'residential'
          AND NOT EXISTS (
            SELECT 1 FROM ${table("category_huawei")} child WHERE child.parent_id = root.category_id
          )
      `, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
