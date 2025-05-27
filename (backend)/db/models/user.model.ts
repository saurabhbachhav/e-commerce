import { Schema, model, models, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  password?: string;
  isOAuth: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  password: {
    type: String,
    required: function (this: IUser) {
      return !this.isOAuth; // Password required only for non-OAuth users
    },
  },
  isOAuth: { type: Boolean, default: false },
});

// Ye check kar ke model banega ya existing model use hoga
const User = models.User || model<IUser>("User", userSchema);

export default User;
