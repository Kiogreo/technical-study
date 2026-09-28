// Exercise 2: move Exercise 1 into Nest's IoC container.
// Run: bun run test src/lessons/01-di-ioc-solid/ex2-nest-tokens
//
// Files you create in this folder:
//   message-sender.ts        -> the MessageSender interface + a MESSAGE_SENDER token
//   email-sender.ts          -> copy of ex1's EmailSender, made injectable
//   notification.service.ts  -> your ex1 refactor, made injectable
//   notifications.module.ts  -> NotificationsModule wiring it all together
import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmailSender } from './email-sender.js';
import { MESSAGE_SENDER } from './message-sender.js';
import { NotificationService } from './notification.service.js';
import { NotificationsModule } from './notifications.module.js';

describe('Exercise 2: NotificationsModule', () => {
  it('binds EmailSender to the MESSAGE_SENDER token by default', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [NotificationsModule],
    }).compile();

    expect(moduleRef.get(MESSAGE_SENDER)).toBeInstanceOf(EmailSender);
  });

  it('lets a test swap the sender without touching NotificationService', async () => {
    const fake = { send: vi.fn().mockResolvedValue(undefined) };

    const moduleRef = await Test.createTestingModule({
      imports: [NotificationsModule],
    })
      .overrideProvider(MESSAGE_SENDER)
      .useValue(fake)
      .compile();

    await moduleRef
      .get(NotificationService)
      .sendWelcome({ email: 'aina@example.com', name: 'Aina' });

    expect(fake.send).toHaveBeenCalledWith('aina@example.com', 'Welcome, Aina!');
  });

  it('exports NotificationService so another module can inject it', async () => {
    @Module({
      imports: [NotificationsModule],
      providers: [
        {
          provide: 'SIGNUP_FLOW',
          useFactory: (notifications: NotificationService) => notifications,
          inject: [NotificationService],
        },
      ],
    })
    class SignupModule {}

    const moduleRef = await Test.createTestingModule({
      imports: [SignupModule],
    }).compile();

    expect(moduleRef.get('SIGNUP_FLOW')).toBeInstanceOf(NotificationService);
  });
});
