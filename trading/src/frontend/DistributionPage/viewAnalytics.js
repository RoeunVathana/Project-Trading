export const normalizeRanking = (records, kind) => records
  .filter((record) => record && Number.isSafeInteger(Number(record.id)) && Number(record.id) > 0)
  .map((record) => {
    const count = Number(record.viewCount);
    const machineCount = Number(record.machineCount);
    const id = Number(record.id);
    return {
      id,
      name: String(record.name || record.model || `${kind === "products" ? "Product" : "Category"} #${id}`).trim(),
      viewCount: Number.isSafeInteger(count) && count > 0 ? count : 0,
      machineCount: Number.isSafeInteger(machineCount) && machineCount > 0 ? machineCount : 0,
      categoryName: String(record.category?.name || "Uncategorized").trim(),
      division: record.division === "factory" ? "Factory" : "CHINT",
    };
  })
  .filter((record) => record.viewCount > 0)
  .sort((left, right) => right.viewCount - left.viewCount || right.machineCount - left.machineCount || right.id - left.id)
  .slice(0, 5);

export const getRankingSummary = (items) => ({
  total: items.reduce((total, item) => total + item.viewCount, 0),
  maximum: Math.max(0, ...items.map((item) => item.viewCount)),
});
