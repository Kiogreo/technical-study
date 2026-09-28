import type { MessageSender } from './message-sender.js';

export interface User {
  email: string;
  name: string;
}

// Exercise 1
// question: the test passes without Nest, so what did the container ever add?
// answer: the container provides a platform for the NestJs to inject dependencies into objects created within the framework
export class NotificationService {
  constructor(private readonly sender: MessageSender) {}

  async sendWelcome(user: User): Promise<void> {
    await this.sender.send(user.email, `Welcome, ${user.name}!`);
  }
}
