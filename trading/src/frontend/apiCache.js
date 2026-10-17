const DEFAULT_TTL = 30_000;

const responseCache = new Map();
const inFlightRequests = new Map();

/**
 * Share short-lived public GET requests between pages. This keeps a product
 * list, detail page, and download page from downloading the same JSON again
 * when a visitor moves through the catalog.
 */
export const fetchCachedJson = async (url, { ttl = DEFAULT_TTL, force = false } = {}) => {
  const cacheKey = String(url);
  const now = Date.now();
  const cached = responseCache.get(cacheKey);

  if (!force && cached && now - cached.createdAt < ttl) {
    return cached.data;
  }

  if (!force && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const request = fetch(cacheKey)
    .then(async (response) => {
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || `Request failed (${response.status}).`);
      }
      responseCache.set(cacheKey, { createdAt: Date.now(), data: result });
      return result;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, request);
  return request;
};

export const clearCachedJson = (urlPrefix = "") => {
  for (const key of responseCache.keys()) {
    if (!urlPrefix || key.startsWith(urlPrefix)) responseCache.delete(key);
  }
};
