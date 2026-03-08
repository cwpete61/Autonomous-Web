import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AiService } from '../src/modules/ai/ai.service';
import { StripeService } from '../src/modules/billing/stripe.service';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { PrismaService } from '../src/modules/prisma/prisma.service';

process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';

describe('AiController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AiService)
      .useValue({
        generateEmailSequence: jest.fn().mockResolvedValue({
          steps: [
            { subject: 'S1', body: 'B1' },
            { subject: 'S2', body: 'B2' },
            { subject: 'S3', body: 'B3' },
          ],
        }),
      })
      .overrideProvider(PrismaService)
      .useValue({ 
        $connect: jest.fn(),
        onModuleInit: jest.fn(),
        auditLog: {
          create: jest.fn().mockResolvedValue({}),
        }
      })
      .overrideProvider(StripeService)
      .useValue({ stripe: {} })
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

  it('/ai/generate-emails (POST)', () => {
    return request(app.getHttpServer())
      .post('/ai/generate-emails')
      .send({
        industry: 'HVAC',
        pain_point_signal: 'Low efficiency',
        primary_outcome: 'Save energy',
        sender_name: 'John Doe',
        sender_company: 'EnergySavers',
        step_count: 3,
      })
      .expect(201);
  });

  it('/ai/generate-emails (POST) - invalid step count', () => {
    return request(app.getHttpServer())
      .post('/ai/generate-emails')
      .send({
        industry: 'HVAC',
        pain_point_signal: 'Low efficiency',
        primary_outcome: 'Save energy',
        sender_name: 'John Doe',
        sender_company: 'EnergySavers',
        step_count: 2,
      })
      .expect(400);
  });
});
