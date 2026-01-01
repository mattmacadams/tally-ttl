/**
 * TallyTTL counts induvidual tallies per given ID with a time-to-live on a per-tally basis.
 */
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
    /**
     * Increment the tally for a given id and return the current count.
     * @param id The identifier to tally.
     * @param ttlSeconds Optional per-call TTL in seconds. Overrides constructor default when provided.
     * @returns The count after incrementing.
     */
    tally(id, ttlSeconds) {
        if (typeof id !== "string" || id.length === 0) {
            throw new Error("id must be a non-empty string");
        }
        const ttl = this.resolveTtl(ttlSeconds);
        const expiresAt = Date.now() + ttl * 1000;
        this.store[id][String(expiresAt)]++;
    }
    increment(id) {
        this.tally(id);
    }
    /**
     * Get the current count without mutating. Returns 0 if missing or expired.
     */
    get(id) {
        const now = Date.now();
        let count = 0;
        for (const t of Object.keys(this.store[id])) {
            if (Number(t) > now) {
                count += this.store[id][t];
            }
        }
        return count;
    }
    /**
     * Manually clear an id's tally.
     */
    clear(id) {
        delete this.store[id];
    }
    /**
     * Remove all expired entries. This is optional; entries are lazily reset on access.
     */
    cleanup() {
        const now = Date.now();
        for (const id of Object.keys(this.store)) {
            for (const t of Object.keys(this.store[id])) {
                if (Number(t) <= now)
                    delete this.store[id][t];
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
