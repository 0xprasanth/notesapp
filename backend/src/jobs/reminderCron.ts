import cron from 'node-cron';
import reminderService from '@/api/reminder/reminder.service';

export const startReminderCron = (): void => {
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    console.log('Running reminder cron job...');
    try {
      await reminderService.processPendingReminders();
    } catch (error) {
      console.error('Error in reminder cron job:', error);
    }
  });

  console.log('Reminder cron job scheduled (runs every 15 minutes)');
};