import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../shared/logger/logger.js";

export const ConnectDB = async (): Promise<void> => {
  const mongoUri = env.MONGO_URI;

  if (!mongoUri) {
    logger.error("[Database] Connection Error: MONGO_URI is not defined.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    logger.info("DataBase connected successfully");
  } catch (error: any) {
    logger.error("[Database] Connection failed:", error?.message || error);
    process.exit(1);
  }
};
