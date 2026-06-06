export interface userData {
    name: string;
    email: string;
    phone?: string;
    password: string;
    isBlocked: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}