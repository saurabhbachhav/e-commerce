import dbConnect from "../../../(backend)/db/database_connection/mongodb_collections";
import Product from "../../../(backend)/db/models/product.model";
import { NextResponse } from "next/server";

// Ensure MongoDB connection
await dbConnect;

// GET: Fetch all products
export async function GET() {
  try {
    const products = await Product.find().lean();
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Add a new product
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newProduct = await Product.create(data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT: Update an existing product
export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json();
    const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE: Remove a product
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
