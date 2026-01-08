import Task, { ITask } from "@/models/Task";
import Reminder, { ReminderStatus } from "@/models/Reminder";
import { AppError } from "@/middlewares/errorHandler";
import mongoose from "mongoose";
import { tasksRoutes } from "..";

interface CreateTaskData {
  title: string;
  description?: string;
  deadline: Date;
  reminderMinutes?: number;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  deadline?: Date;
  isCompleted?: boolean;
  reminderMinutes?: number;
}

class TaskService {
  async createTask(userId: string, data: CreateTaskData): Promise<ITask> {
    // Create task
    const task = await Task.create({
      ...data,
      userId,
      isCompleted: false,
    });

    // Create reminder (24 hours before deadline by default)
    // const reminderHours = task.reminderMinutes ? task.reminderMinutes : parseInt( process.env.REMINDER_HOURS_BEFORE);
    // const scheduledAt = task.reminderMinutes ? new Date(
    //   task.deadline.getTime() - reminderHours * 60 * 60 * 1000
    // ) :  new Date(
    //   task.deadline.getTime() - reminderHours * 60 * 60 * 1000
    // );
    const reminderOffsetMs = task.reminderMinutes
      ? task.reminderMinutes * 60 * 1000 // minutes → ms
      : Number(process.env.REMINDER_HOURS_BEFORE) * 60 * 60 * 1000; // hours → ms

    const scheduledAt = new Date(task.deadline.getTime() - reminderOffsetMs);

    // Only create reminder if scheduled time is in the future
    if (scheduledAt > new Date()) {
      await Reminder.create({
        taskId: task._id,
        userId,
        scheduledAt,
        status: ReminderStatus.PENDING,
        reminderMinutes: task.reminderMinutes,
      });
    }

    return task;
  }

  async getTasks(
    userId: string,
    filters?: { isCompleted?: boolean }
  ): Promise<ITask[]> {
    const query: any = { userId };

    if (filters?.isCompleted !== undefined) {
      query.isCompleted = filters.isCompleted;
    }

    return await Task.find(query).sort({ createdAt: -1 });
  }

  async getTaskById(userId: string, taskId: string): Promise<ITask> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError("Invalid task ID", 400);
    }

    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return task;
  }

  async updateTask(
    userId: string,
    taskId: string,
    data: UpdateTaskData
  ): Promise<ITask> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError("Invalid task ID", 400);
    }

    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    // Update task fields
    if (data.title !== undefined) task.title = data.title;
    if (data.description !== undefined) task.description = data.description;
    if (data.isCompleted !== undefined) task.isCompleted = data.isCompleted;

    // If deadline is updated, update reminder as well
    if (
      data.deadline &&
      data.deadline.toString() !== task.deadline.toString()
    ) {
      task.deadline = data.deadline;

      // Delete old pending reminders
      await Reminder.deleteMany({
        taskId: task._id,
        status: ReminderStatus.PENDING,
      });

      // Create new reminder. Use minutes from data if provided; otherwise default to 60.
      const reminderMinutes =
        typeof data.reminderMinutes === "number"
          ? data.reminderMinutes
          : parseInt(process.env.REMINDER_MINUTES_BEFORE || "60");

      if (reminderMinutes > 0) {
        const deadlineDate = new Date(data.deadline);
        const scheduledAt = new Date(
          deadlineDate.getTime() - reminderMinutes * 60 * 1000
        );

        if (scheduledAt > new Date() && !task.isCompleted) {
          await Reminder.create({
            taskId: task._id,
            userId,
            scheduledAt,
            status: ReminderStatus.PENDING,
          });
        }
      }
    }

    await task.save();
    return task;
  }

  async completeTask(userId: string, taskId: string): Promise<ITask> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError("Invalid task ID", 400);
    }

    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    task.isCompleted = true;
    await task.save();

    // Delete pending reminders for completed tasks
    await Reminder.deleteMany({
      taskId: task._id,
      status: ReminderStatus.PENDING,
    });

    return task;
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new AppError("Invalid task ID", 400);
    }

    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    // Delete task and all associated reminders
    await Promise.all([
      Task.deleteOne({ _id: taskId }),
      Reminder.deleteMany({ taskId }),
    ]);
  }
}

export default new TaskService();
