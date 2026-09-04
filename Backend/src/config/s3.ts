import { S3Client } from "@aws-sdk/client-s3";

export const isS3Configured = (): boolean => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const bucket = process.env.AWS_S3_BUCKET;
  return Boolean(accessKeyId && secretAccessKey && bucket);
};

let cachedClient: S3Client | null = null;

export const getS3Client = (): S3Client => {
  if (cachedClient) return cachedClient;

  const region = process.env.AWS_REGION || "us-east-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

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

export const getS3Bucket = (): string => {
  return process.env.AWS_S3_BUCKET || "";
};
