export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000")
  .replace(/\/$/, "");
export const TOKEN_KEY = "efs-dashboard-token";

export const savedToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

export const requestApi = async (path, { method = "GET", body, token = "" } = {}) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (body instanceof FormData) {
    options.body = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Request failed (${response.status}).`);
  }
  return result;
};

export const fetchAllMachines = async (token) => {
  const firstPage = await requestApi("/api/machines?page=1", { token });
  const machines = [...(firstPage.data || [])];
  const totalPages = firstPage.pagination?.totalPages || 1;

  for (let page = 2; page <= totalPages; page += 1) {
    const result = await requestApi(`/api/machines?page=${page}`, { token });
    machines.push(...(result.data || []));
  }
  return machines;
};
