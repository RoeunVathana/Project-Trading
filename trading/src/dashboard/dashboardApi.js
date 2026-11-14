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

export const requestApi = async (
  path,
  { method = "GET", body, token = "", signal, timeoutMs = 15_000 } = {},
) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const abortRequest = () => controller.abort();
  signal?.addEventListener("abort", abortRequest, { once: true });

  const options = { method, headers, signal: controller.signal };
  if (body instanceof FormData) {
    options.body = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) {
      throw new Error(result.message || `Request failed (${response.status}).`);
    }
    return result;
  } catch (error) {
    if (timedOut) throw new Error("The request timed out. Please try again.", { cause: error });
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortRequest);
  }
};

export const fetchAllMachines = async (token) => {
  const firstPage = await requestApi("/api/machines?page=1", { token });
  const machines = [...(firstPage.data || [])];
  const totalPages = firstPage.pagination?.totalPages || 1;

  if (totalPages <= 1) return machines;

  const pageBatchSize = 4;
  for (let firstPage = 2; firstPage <= totalPages; firstPage += pageBatchSize) {
    const pageBatch = await Promise.all(
      Array.from(
        { length: Math.min(pageBatchSize, totalPages - firstPage + 1) },
        (_, index) => requestApi(`/api/machines?page=${firstPage + index}`, { token }),
      ),
    );
    pageBatch.forEach((result) => machines.push(...(result.data || [])));
  }

  return machines;
};
