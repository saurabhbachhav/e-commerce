import mongoose, { Schema, Document, Types } from "mongoose";

// Define the shape of a single wishlist item
interface WishlistItem {
  productId: Types.ObjectId;
  // Optionally track when the item was added
  addedAt: Date;
}

// Extend Mongoose Document for the wishlist
export interface WishlistDocument extends Document {
  userId: Types.ObjectId;
  items: WishlistItem[];
}

// Schema for individual wishlist items
const WishlistItemSchema = new Schema<WishlistItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    addedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { _id: false }
);

// Main Wishlist schema
const WishlistSchema = new Schema<WishlistDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one wishlist per user
    },
    items: {
      type: [WishlistItemSchema],
      default: [],
    },
  },
  {
    timestamps: true, // createdAt & updatedAt for the wishlist as a whole
  }
);

// Index by userId for fast lookups
WishlistSchema.index({ userId: 1 });

// Export the model (reuse existing if already registered)
export default mongoose.models.Wishlist ||
  mongoose.model<WishlistDocument>("Wishlist", WishlistSchema);
