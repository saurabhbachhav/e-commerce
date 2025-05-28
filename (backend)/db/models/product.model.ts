

import mongoose, { Schema, Document } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  image: string; 
  stock: number;
  category?: string; 
  createdAt: Date;
  updatedAt: Date;
}


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
    timestamps: true, 
  }
);

export default mongoose.models.Product ||
  mongoose.model<ProductDocument>("Product", ProductSchema, "product");
