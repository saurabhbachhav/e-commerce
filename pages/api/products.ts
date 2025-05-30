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


  try {
    await connection;
  } catch (err) {
    console.error("Error connecting to database:", err);
    return res.status(500).json({ error: "Database connection failed" });
  }


  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = 12;
  const skip = (page - 1) * limit;

 
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

 
  const db = mongoose.connection.db;

  try {
   
    const cursor = db!.collection<Product>("product").find(filter);
    const total = await cursor.count();
    const products = await cursor.skip(skip).limit(limit).toArray();

    
    return res.status(200).json({ products });
  } catch (err) {
    console.error("Query error:", err);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
}
