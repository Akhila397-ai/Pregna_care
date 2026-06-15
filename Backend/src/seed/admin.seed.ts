import 'reflect-metadata'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
import UserModel from '../models/User.model.js';
import dotenv from 'dotenv'


dotenv.config();

const seedAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI!);

    const existing = await UserModel.findOne({
        email: "admin@pregnacare.com",
        role: 'admin'
    });
    if(existing){
        console.log('Admin already exists')
        process.exit(0);
    }
    const hashedPassword = await bcrypt.hash('Admin@123',12);
    await UserModel.create({
        name: 'Admin',
        email: "admin@pregnacare.com",
        password: hashedPassword,
        role: 'admin',
        isBlocked: false,
        isVerified: true,
        isDeleted: false,
    });

    console.log('Email:    admin@pregnacare.com');
    console.log('Password: Admin@123');
    process.exit(0);
}


seedAdmin().catch((err) => {
    console.error('seed failed',err)
    process.exit(0);
})