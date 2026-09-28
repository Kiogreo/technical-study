// Exercise 4: provider lifetimes (DEFAULT / REQUEST / TRANSIENT), observed.
// Run: bun run test:e2e src/lessons/01-di-ioc-solid/ex4-scopes
//
// Files you create in this folder (scopes.module.ts exports all of them):
//   hit-counter.ts      -> HitCounter, DEFAULT scope: `hit(): number` returns 1, 2, 3...
//   request-context.ts  -> RequestContext, REQUEST scope: readonly `id` (random, set once)
//   instance-tag.ts     -> InstanceTag, TRANSIENT scope: readonly `id` (random, set once)
//   audit.service.ts    -> AuditService, injects RequestContext + InstanceTag,
//                          exposes `requestId` and `tagId`
//   scopes.controller.ts-> ScopesController, GET /scopes, injects all of the above
//   scopes.module.ts    -> ScopesModule
//
// GET /scopes responds with:
//   { hits, requestId, auditRequestId, tagId, auditTagId }
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { RequestContext } from './request-context.js';
import { ScopesController } from './scopes.controller.js';
import { ScopesModule } from './scopes.module.js';

describe('Exercise 4: injection scopes', () => {
  let moduleRef: TestingModule;
  let app: INestApplication<App>;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [ScopesModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('DEFAULT: one HitCounter shared by every request', async () => {
    const first = await request(app.getHttpServer()).get('/scopes').expect(200);
    const second = await request(app.getHttpServer()).get('/scopes').expect(200);

    expect(first.body.hits).toBe(1);
    expect(second.body.hits).toBe(2);
  });

  it('REQUEST: same RequestContext everywhere within one request', async () => {
    const res = await request(app.getHttpServer()).get('/scopes').expect(200);

    expect(res.body.requestId).toBe(res.body.auditRequestId);
  });

  it('REQUEST: a fresh RequestContext for each new request', async () => {
    const first = await request(app.getHttpServer()).get('/scopes');
    const second = await request(app.getHttpServer()).get('/scopes');

    expect(first.body.requestId).not.toBe(second.body.requestId);
  });

  it('TRANSIENT: each consumer gets its own InstanceTag, even in one request', async () => {
    const res = await request(app.getHttpServer()).get('/scopes').expect(200);

    expect(res.body.tagId).not.toBe(res.body.auditTagId);
  });

  it('get() refuses a scoped provider; resolve() builds a new DI sub-tree each call', async () => {
    expect(() => moduleRef.get(RequestContext)).toThrow();

    const a = await moduleRef.resolve(RequestContext);
    const b = await moduleRef.resolve(RequestContext);
    expect(a).not.toBe(b);
  });

  it('scope bubbles up: the controller became request-scoped too', async () => {
    expect(() => moduleRef.get(ScopesController)).toThrow();

    const a = await moduleRef.resolve(ScopesController);
    const b = await moduleRef.resolve(ScopesController);
    expect(a).not.toBe(b);
  });
});
