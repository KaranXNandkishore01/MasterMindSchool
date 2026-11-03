// In-memory cache with immediate invalidation for lightning-fast public responses
const cacheStore = {};

const getCache = (key, maxAgeMs = 5000) => {
  const entry = cacheStore[key];
  if (entry && (Date.now() - entry.time < maxAgeMs)) {
    return entry.data;
  }
  return null;
};

const setCache = (key, data) => {
  cacheStore[key] = {
    data,
    time: Date.now()
  };
};

const clearCache = (key) => {
  if (key) {
    delete cacheStore[key];
  } else {
    for (const k of Object.keys(cacheStore)) {
      delete cacheStore[k];
    }
  }
};

module.exports = {
  getCache,
  setCache,
  clearCache
};

