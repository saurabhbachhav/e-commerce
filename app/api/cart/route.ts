import { NextRequest, NextResponse } from "next/server";

import Cart from "../../../(backend)/db/models/cart.model";
import Product from "../../../(backend)/db/models/product.model";
import connection from "../../../(backend)/db/database_connection/mongodb_collections";

interface CartItem {
  productId: string;
  quantity: number;
}

interface EnrichedItem {
  product: any; // Replace `any` with the specific product type if available
  quantity: number;
}

export async function GET(req: NextRequest) {
  try {
    await connection;
    const userId = req.nextUrl.searchParams.get("userId")?.trim();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ userId, items: [] });
    }

    const productIds = cart.items.map((item: CartItem) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const enrichedItems: EnrichedItem[] = cart.items.map((item: CartItem) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );
      return {
        product,
        quantity: item.quantity,
      };
    });

    return NextResponse.json({ userId, items: enrichedItems });
  } catch (err) {
    console.error("GET /api/cart error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connection;
    const { userId, item }: { userId: string; item: CartItem } =
      await req.json();

    if (!userId || !item?.productId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const productId = item.productId;
    const quantity = item.quantity;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (i: CartItem) => i.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      if (existingItem.quantity <= 0) {
        cart.items = cart.items.filter(
          (i: CartItem) => i.productId.toString() !== productId
        );
      }
    } else {
      if (quantity > 0) {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/cart error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connection;
    const { userId, productId }: { userId: string; productId: string } =
      await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Missing userId or productId" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter(
      (item: CartItem) => item.productId.toString() !== productId
    );

    await cart.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/cart error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connection;
    const { userId }: { userId: string } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/cart error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
