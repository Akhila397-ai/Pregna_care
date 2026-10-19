export declare class Logger {
    private formatPrefix;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    withContext(contextId: string): {
        debug: (msg: string, ...args: any[]) => void;
        info: (msg: string, ...args: any[]) => void;
        warn: (msg: string, ...args: any[]) => void;
        error: (msg: string, ...args: any[]) => void;
    };
}
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map