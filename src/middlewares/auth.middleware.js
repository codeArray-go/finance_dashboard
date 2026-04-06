import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import redisClient from "../lib/redis.js";
import { findUserById } from "../repositories/auth.repository.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Session expired, please login again" });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    let userId = `userId:${decoded.userId}`;
    const userData = await redisClient.get(userId);
    let user;

    if (userData) {
      user = JSON.parse(userData);
    } else {
      user = await findUserById(decoded.userId);
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid Token" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};
