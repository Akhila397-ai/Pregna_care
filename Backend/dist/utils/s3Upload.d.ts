export type AllowedMimeType = "application/pdf" | "image/jpeg" | "image/jpg" | "image/png";
export declare const ALLOWED_MIME_TYPES: AllowedMimeType[];
export declare const PDF_ONLY: AllowedMimeType[];
export declare const IMAGE_ONLY: AllowedMimeType[];
export declare const MAX_FILE_SIZE: number;
export declare const generateS3Key: (folder: string, mimetype: string) => string;
export declare const uploadToS3: (buffer: Buffer, key: string, mimetype: string) => Promise<string>;
export declare const getPresignedUrl: (key: string, expiresIn?: number) => Promise<string>;
export declare const deleteFromS3: (key: string) => Promise<void>;
export declare const validateFile: (mimetype: string, size: number, allowedTypes: AllowedMimeType[]) => {
    valid: boolean;
    error?: string;
};
//# sourceMappingURL=s3Upload.d.ts.map