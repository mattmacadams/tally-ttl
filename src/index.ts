export type TallyTTLConfig = {
	defaultTtl?: number; // default TTL for new tallies (in seconds)
	cleanupSeconds?: number; // frequency of internal cleanup (in seconds). Note this is just for memory optimzation and does not affect results
};

/**
 * TallyTTL counts induvidual tallies per given ID with a time-to-live on a per-tally basis.
 */
export class TallyTTL {
	private defaultTtl: number = 60;
	private cleanupSeconds: number = 60;
	private store: {
		[key: string]: {
			[key: string]: number;
		};
	} = {};

	private cleanupInterval: ReturnType<typeof setInterval>;

	constructor(config: TallyTTLConfig = {}) {
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
	tally(id: string, ttlSeconds?: number): void {
		if (typeof id !== "string" || id.length === 0) {
			throw new Error("id must be a non-empty string");
		}

		const ttl = this.resolveTtl(ttlSeconds);
		const expiresAt = String(this.now() + ttl);
		this.store[id] = this.store[id] || {};
		this.store[id][expiresAt] = (this.store[id][expiresAt] || 0) + 1;
	}

	increment(id: string) {
		return this.tally(id);
	}

	/**
	 * Get the current count without mutating. Returns 0 if missing or expired.
	 */
	get(id: string): number {
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

	count(id: string): number {
		return this.get(id);
	}

	/**
	 * Manually clear an id's tally.
	 */
	clear(id: string): void {
		delete this.store[id];
	}

	/**
	 * Remove all expired entries. This is optional; entries are lazily reset on access.
	 */
	cleanup(): void {
		const now = this.now();
		if (this.store) {
			for (const id of Object.keys(this.store)) {
				if (this.store[id]) {
					for (const key of Object.keys(this.store[id])) {
						if (Number(key) <= now) delete this.store[id][key];
					}
				}
			}
		}
	}

	private now(): number {
		return Math.floor(Date.now() / 1000);
	}

	private resolveTtl(ttlSeconds?: number): number {
		if (ttlSeconds === undefined) return this.defaultTtl;
		if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
			throw new Error("TallyTTL: ttlSeconds must be a positive finite number when provided");
		}
		return ttlSeconds;
	}
}

export default TallyTTL;
