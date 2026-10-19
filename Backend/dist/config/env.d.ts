interface EnvironmentConfig {
    NODE_ENV: string;
    PORT: number;
    MONGO_URI: string;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_RESET_SECRET: string;
    FRONT_URL: string;
    EMAIL_USER?: string;
    EMAIL_PASS?: string;
    EMAIL_HOST?: string;
    EMAIL_PORT?: number;
    EMAIL_SECURE: boolean;
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    AWS_S3_BUCKET?: string;
    GOOGLE_CLIENT_ID?: string;
}
export declare const env: EnvironmentConfig;
export {};
//# sourceMappingURL=env.d.ts.map