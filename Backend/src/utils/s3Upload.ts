import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
}                        from '@aws-sdk/client-s3';
import { getSignedUrl }  from '@aws-sdk/s3-request-presigner';
import { s3Client, S3_BUCKET } from "../config/s3.js";
import { v4 as uuidv4 }  from 'uuid';

export type AllowedMimeType =
  | 'application/pdf'
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/png';

export const ALLOWED_MIME_TYPES: AllowedMimeType[] = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const PDF_ONLY: AllowedMimeType[] = [
  'application/pdf',
];

export const IMAGE_ONLY: AllowedMimeType[] = [
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const generateS3Key = (
  folder:   string,
  mimetype: string
): string => {
  const extMap: Record<string, string> = {
    'application/pdf': 'pdf',
    'image/jpeg':      'jpg',
    'image/jpg':       'jpg',
    'image/png':       'png',
  };
  const ext  = extMap[mimetype] || 'bin';
  const uuid = uuidv4();
  return `${folder}/${uuid}.${ext}`;
};

export const uploadToS3 = async (
  buffer:   Buffer,
  key:      string,
  mimetype: string
): Promise<string> => {
  await s3Client.send(new PutObjectCommand({
    Bucket:      S3_BUCKET,
    Key:         key,
    Body:        buffer,
    ContentType: mimetype,
  }));
  return key;
};

export const getPresignedUrl = async (
  key: string
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key:    key,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 900 });
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  await s3Client.send(new DeleteObjectCommand({
    Bucket: S3_BUCKET,
    Key:    key,
  }));
};

export const validateFile = (
  mimetype:     string,
  size:         number,
  allowedTypes: AllowedMimeType[]
): { valid: boolean; error?: string } => {
  if (!allowedTypes.includes(mimetype as AllowedMimeType)) {
    return {
      valid: false,
      error: `Invalid type "${mimetype}". Allowed: ${allowedTypes.join(', ')}`,
    };
  }
  if (size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File exceeds 5MB limit.' };
  }
  return { valid: true };
};