import { Request, Response } from "express";
import bcrypt from "bcryptjs"; // for hashing
import { random } from "../helpers";
import User, { createUser, getUserByEmail } from "../models/user.model";

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All values are required" });
    }

    // fetch user including password
    const user = await getUserByEmail(email).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    // generate session token (optional)
    await user.save();

    res.cookie(process.env.SECRET!, {
      domain: "localhost:5173",
      path: "/",
      httpOnly: true,
    });

    return res
      .status(200)
      .json({ user, message: "Logged in successfully" })
      .end();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
};

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, name } = req.body;

    if (!email || !password || !username || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await createUser({
      email,
      username,
      name,
      password: hashedPassword,
      authentication: {
        sessionToken: random(),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
};
