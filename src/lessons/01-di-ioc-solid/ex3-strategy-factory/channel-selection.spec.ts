// Exercise 3: Open/Closed via the strategy pattern + a useFactory provider.
// Run: bun run test src/lessons/01-di-ioc-solid/ex3-strategy-factory
//
// This time YOU write the tests. Replace each it.todo with a real it(...).
// Writing the test first is the point: notice how cheap it is now that the
// sender is injected.

describe('Exercise 3: choosing the channel at composition time', () => {
  it.todo('binds EmailSender when NOTIFY_CHANNEL is "email"');
  it.todo('binds SmsSender when NOTIFY_CHANNEL is "sms"');
  it.todo('falls back to EmailSender when NOTIFY_CHANNEL is unset');
  it.todo('fails fast at startup (compile()) on an unknown channel value');
  it.todo('NotificationService source did not change to support SMS (check with git diff)');
});
