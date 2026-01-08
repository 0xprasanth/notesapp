import Reminder, { ReminderStatus } from '@/models/Reminder';
import Task from '@/models/Task';
import User from '@/models/User';
import emailService from '@/utils/emailService';

class ReminderService {
  async processPendingReminders(): Promise<void> {
    try {
      const now = new Date();

      // Find all pending reminders that are due
      const pendingReminders = await Reminder.find({
        status: ReminderStatus.PENDING,
        scheduledAt: { $lte: now }
      })
        .populate('taskId')
        .populate('userId');

      console.log(`Found ${pendingReminders.length} pending reminders to process`);

      for (const reminder of pendingReminders) {
        try {
          // Skip if task or user doesn't exist
          if (!reminder.taskId || !reminder.userId) {
            await this.markReminderFailed(
              reminder._id.toString(),
              'Task or user not found'
            );
            continue;
          }

          const task = reminder.taskId as any;
          const user = reminder.userId as any;

          // Skip if task is already completed
          if (task.isCompleted) {
            await Reminder.deleteOne({ _id: reminder._id });
            continue;
          }

          // Send email reminder
          const emailSent = await emailService.sendTaskReminder(
            user.email,
            user.name,
            task.title,
            task.description,
            task.deadline
          );

          if (emailSent) {
            // Mark reminder as sent
            await Reminder.findByIdAndUpdate(reminder._id, {
              status: ReminderStatus.SENT,
              sentAt: new Date()
            });
            console.log(`Reminder sent successfully for task: ${task.title}`);
          } else {
            // Mark as failed
            await this.markReminderFailed(
              reminder._id.toString(),
              'Failed to send email'
            );
          }
        } catch (error) {
          console.error(`Error processing reminder ${reminder._id}:`, error);
          await this.markReminderFailed(
            reminder._id.toString(),
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
      }
    } catch (error) {
      console.error('Error in processPendingReminders:', error);
    }
  }

  private async markReminderFailed(reminderId: string, errorMessage: string): Promise<void> {
    await Reminder.findByIdAndUpdate(reminderId, {
      status: ReminderStatus.FAILED,
      errorMessage
    });
  }

  async getReminderStats(userId: string): Promise<any> {
    const stats = await Reminder.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return stats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);
  }
}

export default new ReminderService();