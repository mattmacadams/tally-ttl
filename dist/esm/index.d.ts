export type TallyTTLConfig = {
    defaultTtl?: number;
    cleanupSeconds?: number;
};
export declare class TallyTTL {
    private readonly defaultTtl;
    private readonly store;
    cleanupInterval: number;
    constructor(config?: TallyTTLConfig);
    tally(id: string, ttlSeconds?: number): void;
    increment(id: string): void;
    get(id: string): number;
    clear(id: string): void;
    cleanup(): void;
    private resolveTtl;
}
export default TallyTTL;
//# sourceMappingURL=index.d.ts.map