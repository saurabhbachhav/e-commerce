// pages/api/products.ts
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import connection from "../../(backend)/db/database_connection/mongodb_collections";

interface Product {
  _id: string;
  name: string;
  category?: string;
  description?: string;
  image?: string;
  price?: number;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ products: Product[] } | { error: string }>
) {
  console.log("API route hit");

  // 1) Ensure DB connection
  try {
    await connection;
  } catch (err) {
    console.error("Error connecting to database:", err);
    return res.status(500).json({ error: "Database connection failed" });
  }

  // 2) Parse pagination params
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = 12;
  const skip = (page - 1) * limit;

  // 3) Build filter for optional search
  const q = (req.query.q as string) || "";
  const trimmed = q.trim();
  const filter = trimmed
    ? {
        name: {
          $regex: trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          $options: "i",
        },
      }
    : {};

  // 4) Grab native Db instance
  const db = mongoose.connection.db;

  try {
    // 5) Query with filter, pagination
    const cursor = db!.collection<Product>("product").find(filter);
    const total = await cursor.count();
    const products = await cursor.skip(skip).limit(limit).toArray();

    // 6) Return results (with optional meta)
    return res.status(200).json({ products });
  } catch (err) {
    console.error("Query error:", err);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
}
