const store = new Map();

const removeExpiredEntries = () => {
  const now = Date.now();

  for (const [key, entry] of store) {
    if (entry.expiresAt !== null && entry.expiresAt <= now) {
      store.delete(key);
    }
  }
};

const cleanupInterval = setInterval(removeExpiredEntries, 60 * 1000);
cleanupInterval.unref?.();

const memoryStore = {
  async set(key, value, mode, ttlSeconds) {
    let expiresAt = null;

    if (mode === 'EX') {
      const ttl = Number(ttlSeconds);
      if (!Number.isFinite(ttl) || ttl <= 0) {
        throw new Error('Expiration must be a positive number of seconds');
      }
      expiresAt = Date.now() + ttl * 1000;
    }

    store.set(String(key), { value, expiresAt });
    return 'OK';
  },

  async get(key) {
    const normalizedKey = String(key);
    const entry = store.get(normalizedKey);

    if (!entry) return null;
    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      store.delete(normalizedKey);
      return null;
    }

    return entry.value;
  },

  async del(key) {
    return store.delete(String(key)) ? 1 : 0;
  }
};

console.log('Using in-memory store; Redis is disabled');

export default memoryStore;