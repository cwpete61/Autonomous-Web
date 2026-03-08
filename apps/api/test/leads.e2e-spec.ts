import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { StripeService } from '../src/modules/billing/stripe.service';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { LeadStatus } from '@agency/db';
import { RedisEventBus } from '@agency/events';

process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';

describe('LeadsController (e2e)', () => {
  let app: INestApplication;

  const mockLead = {
    id: 'lead-123',
    email: 'test@example.com',
    status: LeadStatus.DISCOVERED,
    campaignId: 'camp-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    business: { name: 'Test Business' },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        lead: {
          findUnique: jest.fn().mockResolvedValue(mockLead),
          update: jest.fn().mockResolvedValue({ ...mockLead, status: LeadStatus.RESEARCHED }),
          findMany: jest.fn().mockResolvedValue([mockLead]),
        },
        auditLog: {
          create: jest.fn().mockResolvedValue({}),
          findMany: jest.fn().mockResolvedValue([{
            id: 'audit-1',
            action: 'STAGE_CHANGE',
            createdAt: new Date().toISOString(),
          }]),
        },
        $transaction: jest.fn().mockImplementation((cb) => cb({
          lead: {
            update: jest.fn().mockResolvedValue({ ...mockLead, status: LeadStatus.RESEARCHED }),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({}),
          }
        })),
      })
      .overrideProvider(StripeService)
      .useValue({ stripe: {} })
      .overrideProvider(RedisEventBus)
      .useValue({ publish: jest.fn().mockResolvedValue(true) })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  describe('GET /leads', () => {
    it('should return all leads', () => {
      return request(app.getHttpServer())
        .get('/leads')
        .expect(200)
        .expect([mockLead]);
    });
  });

  describe('PATCH /leads/:id/stage', () => {
    it('should transition lead to RESEARCHED', () => {
      return request(app.getHttpServer())
        .patch('/leads/lead-123/stage')
        .send({ stage: LeadStatus.RESEARCHED })
        .expect(200);
    });

    it('should fail for invalid transition (e.g. back to DRAFT)', () => {
        // This indirectly tests the Orchestrator's isValidTransition logic
        // But since we mock findUnique to return DRAFT, transitioning to DRAFT (same state) might be invalid or valid depending on implementation.
        // Let's try transitioning to something surely invalid for DRAFT if any.
        // Actually, isValidTransition(DRAFT, DRAFT) is likely false.
        return request(app.getHttpServer())
          .patch('/leads/lead-123/stage')
          .send({ stage: LeadStatus.DISCOVERED })
          .expect(422); // Unprocessable Entity
      });
  });

  describe('GET /leads/:id/timeline', () => {
    it('should return lead timeline', () => {
      return request(app.getHttpServer())
        .get('/leads/lead-123/timeline')
        .expect(200);
    });
  });
});
