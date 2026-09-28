// Exercise 1: plain TypeScript DI. No Nest, no container.
// Run: bun run test src/lessons/01-di-ioc-solid/ex1-plain-di
import { NotificationService } from './notification.service.js';
import type { MessageSender } from './message-sender.js';

class FakeSender implements MessageSender {
  sent: { to: string; body: string }[] = [];

  async send(to: string, body: string): Promise<void> {
    this.sent.push({ to, body });
  }
}

describe('Exercise 1: NotificationService with constructor injection', () => {
  it('sends the welcome message through whatever sender it is given', async () => {
    const fake = new FakeSender();
    const service = new NotificationService(fake);

    await service.sendWelcome({ email: 'aina@example.com', name: 'Aina' });

    expect(fake.sent).toEqual([
      { to: 'aina@example.com', body: 'Welcome, Aina!' },
    ]);
  });

  it('works with a second, unrelated implementation (swappability)', async () => {
    const log: string[] = [];
    const consoleLike: MessageSender = {
      send: async (to, body) => {
        log.push(`${to}: ${body}`);
      },
    };

    await new NotificationService(consoleLike).sendWelcome({
      email: 'raj@example.com',
      name: 'Raj',
    });

    expect(log).toEqual(['raj@example.com: Welcome, Raj!']);
  });
});
