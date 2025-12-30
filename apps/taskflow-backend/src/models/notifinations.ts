import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId; // Thông báo cho ai
  task?: mongoose.Types.ObjectId; // Liên quan đến task nào (có thể null nếu là thông báo hệ thống)
  message: string;
  type: 'deadline_near' | 'overdue' | 'system';
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    task: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Task' 
      // Không required: true vì có thể là thông báo "Chào mừng bạn mới"
    },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['deadline_near', 'overdue', 'system'],
      default: 'system',
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 1. Index tối ưu hiệu suất: Giúp lấy list thông báo của 1 user cực nhanh
NotificationSchema.index({ user: 1, createdAt: -1 });

// 2. TTL Index (Tính năng Pro): Tự động xóa thông báo sau 30 ngày (2592000 giây)
// Giúp DB không bị phình to vô hạn
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;