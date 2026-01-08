import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html
      });
      
      console.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendTaskReminder(
    userEmail: string,
    userName: string,
    taskTitle: string,
    taskDescription: string,
    deadline: Date
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .task-info { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4F46E5; }
            .deadline { color: #DC2626; font-weight: bold; font-size: 18px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            .btn { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Task Reminder</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>This is a friendly reminder about your upcoming task:</p>
              
              <div class="task-info">
                <h2 style="margin-top: 0; color: #4F46E5;">${taskTitle}</h2>
                ${taskDescription ? `<p style="color: #6b7280;">${taskDescription}</p>` : ''}
                <p class="deadline">
                  📅 Deadline: ${deadline.toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <p>Don't forget to complete this task before the deadline!</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">
                  View Task
                </a>
              </div>
            </div>
            <div class="footer">
              <p>You're receiving this email because you set a reminder for this task.</p>
              <p>&copy; ${new Date().getFullYear()} Task Manager. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail({
      to: userEmail,
      subject: `⏰ Reminder: ${taskTitle}`,
      html
    });
  }
}

export default new EmailService();