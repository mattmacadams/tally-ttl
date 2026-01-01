export type TallyTTLConfig = {
    defaultTtl?: number;
    cleanupSeconds?: number;
};
/**
 * TallyTTL counts induvidual tallies per given ID with a time-to-live on a per-tally basis.
 */
export declare class TallyTTL {
    private readonly defaultTtl;
    private readonly store;
    cleanupInterval: number;
    constructor(config?: TallyTTLConfig);
    /**
     * Increment the tally for a given id and return the current count.
     * @param id The identifier to tally.
     * @param ttlSeconds Optional per-call TTL in seconds. Overrides constructor default when provided.
     * @returns The count after incrementing.
     */
    tally(id: string, ttlSeconds?: number): void;
    increment(id: string): void;
    /**
     * Get the current count without mutating. Returns 0 if missing or expired.
     */
    get(id: string): number;
    /**
     * Manually clear an id's tally.
     */
    clear(id: string): void;
    /**
     * Remove all expired entries. This is optional; entries are lazily reset on access.
     */
    cleanup(): void;
    private resolveTtl;
}
export default TallyTTL;
