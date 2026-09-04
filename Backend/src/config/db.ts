import mongoose from "mongoose";

export const ConnectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("[Database] Connection Error: MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("DataBase connected");
  } catch (error: any) {
    console.error("[Database] Connection failed:", error?.message || error);
    process.exit(1);
  }
};



