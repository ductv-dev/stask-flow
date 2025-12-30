import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  avatar: string;
  provider: 'local' | 'google';
  googleId?: string;
  settings: {
    theme: 'light' | 'dark';
    pushToken?: string;
  };
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, 
    avatar: { 
      type: String, 
      default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    provider: { 
      type: String, 
      enum: ['local', 'google'], 
      default: 'local' 
    },
    googleId: { type: String },
    settings: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      pushToken: { type: String },
    },
  },
  {
    timestamps: true, 
  }
);

UserSchema.pre('save', async function () {
  const user = this as unknown as IUser;

  if (!user.isModified('password')) {
    return;
  }
  
  // 2. Tạo salt và hash password
  const salt = await bcrypt.genSalt(10);
  if (user.password) {
    user.password = await bcrypt.hash(user.password, salt);
  }
  // Không cần gọi next() nữa
});
// -----------------------

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;