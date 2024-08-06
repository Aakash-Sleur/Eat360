import { Request, Response } from "express";

import { authentication, random } from "../helpers";
import User, { createUser, getUserByEmail } from "../models/user.model";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // checking if all the fields are filled
    if (!email || !password) {
      return res.sendStatus(400);
    }

    // fetching the user of the respective email address
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.sendStatus(400);
    }

    // checking the hashed password and the password send are the same
    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie(process.env.SECRET, user.authentication.sessionToken, {
      domain: "localhost:5173",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(error);
    return res.status(400);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, name } = req.body;

    if (!email || !password || !username || !name) {
      return res.sendStatus(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.sendStatus(400).json({ message: "User already exists" });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      name,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(error);
    return res.sendStatus(400).json(error);
  }
};
