import mongoose, { Document, Schema } from "mongoose";
import { number, string } from "zod";

export interface ITask extends Document {
  title: string;
  description: string;
  deadline: Date;
  reminderMinutes: number;
  isCompleted: boolean;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "Deadline must be in the future",
      },
    },
    reminderMinutes: {
      type: Number,
      required: [true, "reminderMinutes is required"],
      // validate: {
      //   validator: function (value: Date) {
      //     return value > new Date();
      //   },
      //   message: "reminderMinutes must be in the future",
      // },
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, deadline: 1 });

export default mongoose.model<ITask>("Task", taskSchema);
