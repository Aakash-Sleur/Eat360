import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JwtPayload {
  userId: string;
  email: string;
}

// 👇 Extend Express Request type so `req.user` works without TypeScript error
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      _id: string;
      email: string;
      username: string;
      name: string;
    };
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    console.log(decoded, "<<<")

    // Fetch user from DB
    const user = await User.findById(decoded.userId)
      .select("email username name")
      .lean();

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user to request object
    req.user = {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
    };

    next();
  } catch (error: any) {
    console.error("JWT verification failed:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
