export type TallyTTLConfig = {
    defaultTtl?: number;
    cleanupSeconds?: number;
};
export declare class TallyTTL {
    private defaultTtl;
    private cleanupSeconds;
    private store;
    private cleanupInterval;
    constructor(config?: TallyTTLConfig);
    tally(id: string, ttlSeconds?: number): void;
    increment(id: string): void;
    get(id: string): number;
    count(id: string): number;
    clear(id: string): void;
    cleanup(): void;
    private now;
    private resolveTtl;
}
export default TallyTTL;
//# sourceMappingURL=index.d.ts.map