# Lesson 1: Dependency Injection, IoC and SOLID (practical)

The theory is in the career-growth wiki:
`topics/career-growth/output/projects/technical-interview-study-plan-execution/study-guide-lesson-01-di-ioc-solid-2026-09-28.md`.
Read Part 1 there before starting. This folder is where you practise.

The specs are written, and your job is to make them pass. They start red on
purpose. Do the exercises in order, because each one builds on the previous.

```bash
bun run test src/lessons/01-di-ioc-solid        # Exercises 1-3
bun run test:e2e src/lessons/01-di-ioc-solid    # Exercise 4
bun run test:watch src/lessons/01-di-ioc-solid  # keep this open while you work
```

Time box: about 2.5 hours total. Stop at the box even if you're mid-exercise,
and log where you got to.

---

## Exercise 1: DI with no framework (20 min)

`ex1-plain-di/`

Run the spec first and read the error. `NotificationService` builds its own
`EmailSender` inside itself, so the test cannot stop it from sending a real
email. That failure is the whole argument for DI in one line of output.

1. Create `message-sender.ts` exporting a `MessageSender` interface with
   `send(to: string, body: string): Promise<void>`.
2. Refactor `NotificationService` so the constructor takes a `MessageSender`.
   Delete the `new EmailSender()`.
3. Leave `email-sender.ts` alone.

Done when both tests pass. **Say out loud before moving on:** "the test passes
without Nest, so what did the container ever add?" You'll answer that in
Exercise 2.

## Exercise 2: Hand construction over to Nest (35 min)

`ex2-nest-tokens/`

The spec lists the four files to create. You can copy them from Exercise 1 as
a starting point.

- `MessageSender` is an interface, and interfaces don't exist at runtime, so
  Nest can't inject by it. Export a token next to it
  (`export const MESSAGE_SENDER = Symbol('MESSAGE_SENDER')`), then inject it
  with `@Inject(MESSAGE_SENDER)`.
- In the module, bind the token with a custom provider (`provide` + `useClass`).
- Export only what other modules need.

Done when all 3 tests pass. **Then answer in your own words:** why does the
test use `overrideProvider(MESSAGE_SENDER)` rather than
`overrideProvider(EmailSender)`? What would break if you had registered
`EmailSender` directly?

## Exercise 3: Open for extension, closed for modification (40 min)

`ex3-strategy-factory/`

Nothing is given here except `it.todo` stubs. You write the tests this time.

1. Commit your Exercise 2 work first (`git add -A && git commit`), so the last
   todo can be checked with `git diff`.
2. Add an `SmsSender` that implements `MessageSender`.
3. Replace `useClass` with a `useFactory` that reads `NOTIFY_CHANNEL`
   (`email` | `sms`, default `email`) and returns the right sender. Throw on
   anything else, so a typo in config fails at startup and not on the first
   real message.
4. Turn every `it.todo` into a passing `it`. Hint: set `process.env` before
   `compile()` and restore it in `afterEach`.

Stretch: inject a `ConfigService`-like provider into the factory via `inject`
rather than reading `process.env` directly. Which version is easier to test?

## Exercise 4: Provider lifetimes, observed (40 min)

`ex4-scopes/`, which is an e2e spec (note the different command).

The spec header lists the six files and the response shape. Build them, then
make all 6 tests pass. Two of them test things you might not expect:

- `moduleRef.get()` throws for a REQUEST-scoped provider. Why does Nest refuse?
- `ScopesController` never asked to be request-scoped, but it became one. Why?

Stretch: put a `console.log` in each constructor, hit `/scopes` three times
with the app running (`bun run start:dev`), and count constructor calls per
class. Then write one sentence on the performance cost of REQUEST scope.

## After the session

Append a dated entry to the project's `study-log.md` in the wiki. Record
which exercises passed, your confidence 1-5 on the "why DI" answer, and what
confused you. Tick checklist items only if you can explain them without notes.
