import type { NextApiRequest, NextApiResponse } from "next";
import connection from "../../(backend)/db/database_connection/mongodb_collections" // your DB connection helper
import User from "../../(backend)/db/models/user.model";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  await  connection;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  // console.log("Request body:", req.body);

  const { name, email, password, contact } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      contact: contact || undefined,
    });

    await user.save();

    // Don't send password back!
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      contact: user.contact,
    };

    return res
      .status(201)
      .json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
