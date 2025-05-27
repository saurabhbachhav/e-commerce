// backend/db/models/cart.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for a cart item
interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
}

// Interface for the entire cart document
export interface CartDocument extends Document {
  userId: Types.ObjectId;
  items: CartItem[];
}

// Schema for cart item
const CartItemSchema = new Schema<CartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", // 👈 MUST match the model name used in product.model.ts
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

// Schema for cart
const CartSchema = new Schema<CartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // ✅ Ensure you have a User model with this name if used
      required: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

// Create index for fast lookups
CartSchema.index({ userId: 1 });

// Export model
export default mongoose.models.Cart ||
  mongoose.model<CartDocument>("Cart", CartSchema);
