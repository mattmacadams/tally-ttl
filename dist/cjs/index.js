"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TallyTTL = void 0;
/**
 * TallyTTL counts induvidual tallies per given ID with a time-to-live on a per-tally basis.
 */
class TallyTTL {
    constructor(config = {}) {
        this.defaultTtl = 60;
        this.cleanupSeconds = 60;
        this.store = {};
        if (config.defaultTtl) {
            if (!Number.isFinite(config.defaultTtl) || !config.defaultTtl || config.defaultTtl <= 0) {
                throw new Error("When provided, defaultTtlSeconds must be a positive finite number");
            }
            this.defaultTtl = config.defaultTtl;
        }
        if (config.cleanupSeconds) {
            if (!Number.isFinite(config.cleanupSeconds) || config.cleanupSeconds < 1) {
                throw new Error("When provided, cleanupSeconds must be a positive finite number");
            }
            this.cleanupSeconds = config.cleanupSeconds;
        }
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, this.cleanupSeconds * 1000);
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
        const expiresAt = String(this.now() + ttl);
        this.store[id] = this.store[id] || {};
        this.store[id][expiresAt] = (this.store[id][expiresAt] || 0) + 1;
    }
    increment(id) {
        return this.tally(id);
    }
    /**
     * Get the current count without mutating. Returns 0 if missing or expired.
     */
    get(id) {
        const now = this.now();
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
    count(id) {
        return this.get(id);
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
        const now = this.now();
        if (this.store) {
            for (const id of Object.keys(this.store)) {
                if (this.store[id]) {
                    for (const key of Object.keys(this.store[id])) {
                        if (Number(key) <= now)
                            delete this.store[id][key];
                    }
                }
            }
        }
    }
    now() {
        return Math.floor(Date.now() / 1000);
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
exports.TallyTTL = TallyTTL;
exports.default = TallyTTL;
