import mongoose, { Document, Schema } from 'mongoose';

export enum ReminderStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed'
}

export interface IReminder extends Document {
  taskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  scheduledAt: Date;
  status: ReminderStatus;
  errorMessage?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reminderSchema = new Schema<IReminder>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    scheduledAt: {
      type: Date,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(ReminderStatus),
      default: ReminderStatus.PENDING,
      index: true
    },
    errorMessage: {
      type: String
    },
    sentAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Compound index for finding pending reminders
reminderSchema.index({ status: 1, scheduledAt: 1 });

export default mongoose.model<IReminder>('Reminder', reminderSchema);