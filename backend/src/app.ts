import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "@/config/env";
import { errorHandler, notFound } from "@/middlewares/errorHandler";
import { registerRoutes } from "@/routes";

const app: express.Application = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(
  cors({
    origin: process.env.CORS_PATH.split(","),
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Health check endpoint - must be registered before other routes
app.get("/api/health", (req, res) => {
  console.log(`Health check endpoint hit - ${req.method} ${req.originalUrl}`);

  const timestamp = new Date().toISOString();
  res.status(200).json({
    success: true,
    message: "Noteapp Platform API is running",
    timestamp: timestamp,
    environment: env.NODE_ENV,
  });
});

// Register all API routes with /api/v1 prefix
registerRoutes(app);

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
