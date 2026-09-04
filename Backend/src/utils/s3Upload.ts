import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client, getS3Bucket, isS3Configured } from "../config/s3.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

export type AllowedMimeType =
  | "application/pdf"
  | "image/jpeg"
  | "image/jpg"
  | "image/png";

export const ALLOWED_MIME_TYPES: AllowedMimeType[] = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export const PDF_ONLY: AllowedMimeType[] = ["application/pdf"];

export const IMAGE_ONLY: AllowedMimeType[] = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const generateS3Key = (
  folder: string,
  mimetype: string
): string => {
  const extMap: Record<string, string> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
  };
  const ext = extMap[mimetype] || "bin";
  const uuid = uuidv4();
  return `${folder}/${uuid}.${ext}`;
};

export const uploadToS3 = async (
  buffer: Buffer,
  key: string,
  mimetype: string
): Promise<string> => {
  if (isS3Configured()) {
    const s3Client = getS3Client();
    const bucket = getS3Bucket();
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: mimetype,
        })
      );
      return key;
    } catch (error: any) {
      console.error("[S3 Upload Error]:", error?.message || error);
      throw new Error("Failed to upload document to cloud storage.");
    }
  }

  // Fallback to local disk storage when AWS S3 is not configured
  const localFilePath = path.resolve(process.cwd(), "uploads", key);
  await fs.mkdir(path.dirname(localFilePath), { recursive: true });
  await fs.writeFile(localFilePath, buffer);
  return key;
};

export const getPresignedUrl = async (
  key: string,
  expiresIn: number = 600
): Promise<string> => {
  if (!key) return "";

  if (isS3Configured()) {
    try {
      const s3Client = getS3Client();
      const bucket = getS3Bucket();
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error: any) {
      console.error("[S3 Presigned URL Error]:", error?.message || error);
      return `/uploads/${key}`;
    }
  }

  return `/uploads/${key}`;
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  if (!key) return;

  if (isS3Configured()) {
    try {
      const s3Client = getS3Client();
      const bucket = getS3Bucket();
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      );
    } catch (error: any) {
      console.error("[S3 Delete Error]:", error?.message || error);
    }
    return;
  }

  try {
    const localFilePath = path.resolve(process.cwd(), "uploads", key);
    await fs.unlink(localFilePath);
  } catch {
    // Ignore if file already removed
  }
};

export const validateFile = (
  mimetype: string,
  size: number,
  allowedTypes: AllowedMimeType[]
): { valid: boolean; error?: string } => {
  if (!allowedTypes.includes(mimetype as AllowedMimeType)) {
    return {
      valid: false,
      error: `Invalid type "${mimetype}". Allowed: ${allowedTypes.join(", ")}`,
    };
  }
  if (size > MAX_FILE_SIZE) {
    return { valid: false, error: "File exceeds 5MB limit." };
  }
  return { valid: true };
};