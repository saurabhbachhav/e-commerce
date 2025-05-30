import { NextRequest, NextResponse } from "next/server";

import Wishlist from "../../../(backend)/db/models/wishlist.model";
import Product from "../../../(backend)/db/models/product.model";
import connection from "../../../(backend)/db/database_connection/mongodb_collections";

interface WishlistItem {
  productId: string;
}

interface EnrichedItem {
  product: any; // Replace `any` with the specific product type if available
}

export async function GET(req: NextRequest) {
  try {
    await connection;
    const userId = req.nextUrl.searchParams.get("userId")?.trim();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist || wishlist.items.length === 0) {
      return NextResponse.json({ userId, items: [] });
    }

    const productIds = wishlist.items.map(
      (item: WishlistItem) => item.productId
    );
    const products = await Product.find({ _id: { $in: productIds } });

    const enrichedItems: EnrichedItem[] = wishlist.items.map(
      (item: WishlistItem) => {
        const product = products.find(
          (p) => p._id.toString() === item.productId.toString()
        );
        return {
          product,
        };
      }
    );

    return NextResponse.json({ userId, items: enrichedItems });
  } catch (err) {
    console.error("GET /api/wishlist error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connection;
    const { userId, item }: { userId: string; item: WishlistItem } =
      await req.json();

    if (!userId || !item?.productId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const productId = item.productId;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    const existingItem = wishlist.items.find(
      (i: WishlistItem) => i.productId.toString() === productId
    );

    if (!existingItem) {
      wishlist.items.push({ productId });
    }

    await wishlist.save();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/wishlist error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connection;
    const { userId, productId }: { userId: string; productId: string } =
      await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      wishlist.items = wishlist.items.filter(
        (item: WishlistItem) => item.productId.toString() !== productId
      );
      await wishlist.save();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/wishlist error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
