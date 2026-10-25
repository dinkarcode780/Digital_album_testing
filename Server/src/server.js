import dotenv from "dotenv";
dotenv.config();
import dns from "dns";

// Prefer IPv4 globally to avoid IPv6 ENETUNREACH / Connection Timeout on cloud hosting like Render
dns.setDefaultResultOrder("ipv4first");

import app from "./app.js";
import { createServer } from "http";
import databaseConnection from "./config/db.js";
import { createDefaultAdmin } from "./models/userModel.js";

const PORT = process.env.PORT || 1000;

await databaseConnection();
await createDefaultAdmin();
const server = createServer(app);


server.listen(PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err?.message || err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err?.message || err);
  server.close(() => process.exit(1));
});