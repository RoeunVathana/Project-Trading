import { API_BASE_URL } from "./dashboardApi";

export const defaultForm = (config, record) => {
  const values = {};
  config.fields.forEach((field) => {
    values[field.name] = field.type === "file"
      ? null
      : String(record?.[field.name] ?? (field.name === "sortOrder" ? 0 : ""));
    if (field.clearField) values[field.clearField] = false;
  });
  return values;
};

export const recordTitle = (resource, record) => {
  if (resource === "machines") return record.name || record.model;
  if (resource === "categories") return record.name;
  if (resource === "gallery") return `Gallery image #${record.id}`;
  if (resource === "specs") return record.frameVariation || record.specName || `Specification #${record.id}`;
  if (resource === "pdfs") return record.fileName || `PDF #${record.id}`;
  if (resource === "users") return displayAccountName(record, `User #${record.id}`);
  return `Record #${record.id}`;
};

export const displayAccountName = (account, fallback = "User") => {
  const value = account?.name || account?.username || account?.email || fallback;
  const name = String(value).split("@")[0].trim();
  return name || fallback;
};

export const bytesLabel = (bytes) => {
  if (!Number.isFinite(Number(bytes))) return "—";
  const size = Number(bytes);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const publicFileUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
