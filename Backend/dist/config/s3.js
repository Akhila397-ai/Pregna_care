import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env.js";
export const isS3Configured = () => {
    return Boolean(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_S3_BUCKET);
};
let cachedClient = null;
export const getS3Client = () => {
    if (cachedClient)
        return cachedClient;
    const region = env.AWS_REGION;
    const accessKeyId = env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = env.AWS_SECRET_ACCESS_KEY;
    cachedClient = new S3Client({
        region,
        ...(accessKeyId && secretAccessKey
            ? {
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            }
            : {}),
    });
    return cachedClient;
};
export const getS3Bucket = () => {
    return env.AWS_S3_BUCKET || "";
};
//# sourceMappingURL=s3.js.map