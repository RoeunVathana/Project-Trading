export const normalizeSearchText = (value) => String(value || "")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

export const searchMatches = (text, query) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const normalizedText = normalizeSearchText(text);
  return normalizedQuery.split(/\s+/).every((word) => normalizedText.includes(word));
};
