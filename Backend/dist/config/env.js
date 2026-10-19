import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
if (!process.env.MONGO_URI) {
    dotenv.config({ path: path.resolve(__dirname, "../../.env") });
}
function validateEnv() {
    const isProduction = process.env.NODE_ENV === "production";
    const requiredVars = [
        "MONGO_URI",
        "JWT_SECRET",
        "JWT_REFRESH_SECRET",
    ];
    const missing = requiredVars.filter((v) => !process.env[v]);
    if (missing.length > 0 && isProduction) {
        throw new Error(`[EnvConfig] Missing critical environment variables: ${missing.join(", ")}`);
    }
    return {
        NODE_ENV: process.env.NODE_ENV || "development",
        PORT: parseInt(process.env.PORT || "5000", 10),
        MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/pregnacare",
        JWT_SECRET: process.env.JWT_SECRET || "default_jwt_secret_dev_only",
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default_refresh_secret_dev_only",
        JWT_RESET_SECRET: process.env.JWT_RESET_SECRET || process.env.JWT_SECRET || "default_reset_secret_dev_only",
        FRONT_URL: process.env.FRONT_URL || "http://localhost:5173",
        EMAIL_USER: process.env.EMAIL_USER?.trim(),
        EMAIL_PASS: process.env.EMAIL_PASS?.replace(/\s+/g, ""),
        EMAIL_HOST: process.env.EMAIL_HOST?.trim(),
        EMAIL_PORT: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : undefined,
        EMAIL_SECURE: process.env.EMAIL_SECURE === "true" || process.env.EMAIL_PORT === "465",
        AWS_REGION: process.env.AWS_REGION || "us-east-1",
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID?.trim(),
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY?.trim(),
        AWS_S3_BUCKET: process.env.AWS_S3_BUCKET?.trim(),
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID,
    };
}
export const env = validateEnv();
//# sourceMappingURL=env.js.map