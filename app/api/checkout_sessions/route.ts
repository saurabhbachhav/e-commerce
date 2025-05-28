import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Define a type for items
interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { items, email }: { items: Item[]; email: string } = body;

  const lineItems = items.map((item: Item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
        metadata: { productId: item.id },
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    customer_email: email,
  });

  return NextResponse.json({ id: session.id });
}
