// backend/db/models/product.model.ts

import mongoose, { Schema, Document } from "mongoose";

// 1. Interface for a Product document
export interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  image: string; // URL for the product image
  stock: number;
  category?: string; // Optional field
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the schema
const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

// 3. Export model and explicitly use the 'product' collection name
export default mongoose.models.Product ||
  mongoose.model<ProductDocument>("Product", ProductSchema, "product");
