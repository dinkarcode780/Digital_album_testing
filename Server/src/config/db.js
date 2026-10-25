import mongoose from "mongoose";

const databaseConnection = async () => {
  const DB_URL = process.env.DB_URL;

  if (!DB_URL) {
    console.error("DB_URL environment variable is not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(DB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default databaseConnection;
