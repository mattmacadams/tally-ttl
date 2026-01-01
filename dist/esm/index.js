export class TallyTTL {
    constructor(config = {}) {
        this.store = {};
        const { defaultTtl = 60, cleanupSeconds = 120000 } = config;
        if (!Number.isFinite(defaultTtl) || defaultTtl <= 0) {
            throw new Error("defaultTtlSeconds must be a positive finite number");
        }
        this.defaultTtl = defaultTtl;
        this.cleanupInterval = setInterval(this.cleanup, cleanupSeconds);
    }
    tally(id, ttlSeconds) {
        if (typeof id !== "string" || id.length === 0) {
            throw new Error("id must be a non-empty string");
        }
        const ttl = this.resolveTtl(ttlSeconds);
        const expiresAt = String(Date.now() + ttl * 1000);
        this.store[id] = this.store[id] || {};
        this.store[id][expiresAt] = (this.store[id][expiresAt] || 0) + 1;
    }
    increment(id) {
        this.tally(id);
    }
    get(id) {
        const now = Date.now();
        let count = 0;
        if (this.store[id]) {
            for (const t of Object.keys(this.store[id])) {
                if (Number(t) > now) {
                    count += this.store[id][t] || 0;
                }
            }
        }
        return count;
    }
    clear(id) {
        delete this.store[id];
    }
    cleanup() {
        const now = Date.now();
        for (const id of Object.keys(this.store)) {
            if (this.store[id]) {
                for (const t of Object.keys(this.store[id])) {
                    if (Number(t) <= now)
                        delete this.store[id][t];
                }
            }
        }
    }
    resolveTtl(ttlSeconds) {
        if (ttlSeconds === undefined)
            return this.defaultTtl;
        if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
            throw new Error("TallyTTL: ttlSeconds must be a positive finite number when provided");
        }
        return ttlSeconds;
    }
}
export default TallyTTL;
