import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
app.use(helmet());

// import Routes
import userRoute from "./api/routes/userRoute.js";
import eventRoute from "./api/routes/eventRoute.js";
import eventCategoryRoute from "./api/routes/eventCategoryRoute.js";
import subcategoryRoute from "./api/routes/subCategoryRoute.js";
import mediaRoute from "./api/routes/mediaRoute.js";
import adminRoute from "./api/routes/adminRoute.js";
import inviteRoute from "./api/routes/inviteRoute.js";
import aboutRoute from "./api/routes/aboutRoute.js";
import serviceRoute from "./api/routes/serviceRoute.js";
import companyRoute from "./api/routes/companyRoute.js";
import memberRoute from "./api/routes/memberRoute.js";
import blogRoute from "./api/routes/blogRoute.js";
import userslectedMediaRoute from "./api/routes/userslectedMediaRoute.js";
import subscriptionRoute from "./api/routes/subscriptionRoute.js";
import subscriptionWebhookRoute from "./api/routes/subscriptionWebhookRoute.js";
import publicStudioRoute from "./api/routes/publicStudioRoute.js";
import studioShowcaseRoute from "./api/routes/studioShowcaseRoute.js";
import bookingRoute from "./api/routes/bookingRoute.js";

app.use("/api/subscriptions/webhook", express.raw({ type: "application/json" }), subscriptionWebhookRoute);
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many OTP requests. Please try again after 1 hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/users/userLogin", authLimiter);
app.use("/api/admin/adminLogin", authLimiter);
app.use("/api/users/userForgetPassword", otpLimiter);
app.use("/api/users/userResetPassword", otpLimiter);
app.use("/api/users/userRegister", authLimiter);
app.use("/api/booking/create", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many booking requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("tiny"));
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// API routes
app.use("/api", publicStudioRoute);
app.use("/api", studioShowcaseRoute);
app.use("/api", bookingRoute);
app.use("/api", userRoute);
app.use("/api", eventRoute);
app.use("/api", eventCategoryRoute);
app.use("/api", subcategoryRoute);
app.use("/api", mediaRoute);
app.use("/api", adminRoute);
app.use("/api", inviteRoute);
app.use("/api", aboutRoute);
app.use("/api", serviceRoute);
app.use("/api", companyRoute);
app.use("/api", memberRoute);
app.use("/api", blogRoute);
app.use("/api", userslectedMediaRoute);
app.use("/api", subscriptionRoute);

// app.use((req, res) => {
//   res.status(404).json({ success: false, message: "Route not found" });
// });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

export default app;