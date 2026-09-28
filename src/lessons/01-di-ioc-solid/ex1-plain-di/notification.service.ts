import { EmailSender } from './email-sender.js';

export interface User {
  email: string;
  name: string;
}

// BEFORE: this class builds its own dependency.
// Your job (Exercise 1): refactor it so the sender comes in from outside.
export class NotificationService {
  private readonly sender = new EmailSender();

  async sendWelcome(user: User): Promise<void> {
    await this.sender.send(user.email, `Welcome, ${user.name}!`);
  }
}
