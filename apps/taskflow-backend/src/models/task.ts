import mongoose, { Document, Schema } from 'mongoose';

// Định nghĩa kiểu cho Subtask (việc nhỏ bên trong việc lớn)
interface ISubtask {
  title: string;
  isDone: boolean;
}

export interface ITask extends Document {
  user: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId; // Có thể null nếu task không thuộc dự án nào
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done' | 'archived';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  subtasks: ISubtask[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    project: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Project' 
    },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done', 'archived'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: { type: Date },
    subtasks: [
      {
        title: { type: String, required: true },
        isDone: { type: Boolean, default: false },
      },
    ],
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Tạo Index để tìm kiếm nhanh hơn
// Ví dụ: Tìm tất cả task của User A có trạng thái là 'todo'
TaskSchema.index({ user: 1, status: 1 });

const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;