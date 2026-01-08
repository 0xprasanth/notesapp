// Netlify function wrapper for the Express app
// This file imports the compiled Express `app` from `dist/app` and
// exposes a Netlify-compatible handler using `serverless-http`.
const serverless = require("serverless-http");
const appModule = require("../dist/app");
const connectDbModule = require("../dist/config/db");

// Support both `module.exports = app` and `exports.default = app`
const app = appModule && appModule.default ? appModule.default : appModule;

// Connect to DB on cold start (only once per function instance)
let dbConnected = false;
const ensureDb = async () => {
  if (dbConnected) return;
  try {
    if (
      connectDbModule &&
      typeof connectDbModule.connectDatabase === "function"
    ) {
      await connectDbModule.connectDatabase();
      dbConnected = true;
      console.log("✅ MongoDB connected (function cold start)");
    } else {
      console.warn("⚠️ connectDatabase() not found in ../dist/config/db");
    }
  } catch (err) {
    console.error("❌ Failed to connect MongoDB in function cold start:", err);
  }
};

// Start DB connection but do NOT start any background cron jobs.
ensureDb();

module.exports.handler = serverless(app);
