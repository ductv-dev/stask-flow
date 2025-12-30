import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  color: string;
  user: mongoose.Types.ObjectId; // Link tới User
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    color: { type: String, default: '#000000' }, // Mặc định màu đen nếu không chọn
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', // Tham chiếu sang collection 'users'
      required: true 
    },
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>('Project', ProjectSchema);
export default Project;