"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE "huawei_catalog"."huawei" AS product
         SET "base_image_url" = image."image_url"
        FROM (
          SELECT DISTINCT ON (product_id)
                 product_id,
                 image_url
            FROM "huawei_catalog"."product_images"
           ORDER BY product_id, is_primary DESC, display_order ASC, image_id ASC
        ) AS image
       WHERE product.product_id = image.product_id
         AND (product.base_image_url IS NULL OR product.base_image_url = '')
    `);
  },

  async down() {
    // Base images are user-managed values; do not clear them on rollback.
  },
};
