import express from "express";
import cors from "cors";
import { ENV } from "./lib/env.js";
import authRoute from "./routes/auth.routes.js";
import dataRoute from "./routes/data.routes.js";
import { createTable } from "./lib/schema.js";
import { connectRedis } from "./lib/redis.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: [ENV.CLIENT_URI],
    credentials: true,
  }),
);

app.use("/api/auth", authRoute);
app.use("/api/data", dataRoute);

const PORT = ENV.PORT || 5000;

const serverStart = async () => {
  try {
    await connectRedis();
    await createTable();

    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server listning on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error: ", error);
  }
};

serverStart();
