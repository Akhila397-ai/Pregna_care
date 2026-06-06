import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password,12)
}

export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
    return await bcrypt.compare(plain, hashed)
}