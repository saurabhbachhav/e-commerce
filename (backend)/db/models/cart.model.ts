
import mongoose, { Schema, Document, Types } from "mongoose";


interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
}


export interface CartDocument extends Document {
  userId: Types.ObjectId;
  items: CartItem[];
}


const CartItemSchema = new Schema<CartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", 
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


const CartSchema = new Schema<CartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true, 
  }
);


CartSchema.index({ userId: 1 });


export default mongoose.models.Cart ||
  mongoose.model<CartDocument>("Cart", CartSchema);
