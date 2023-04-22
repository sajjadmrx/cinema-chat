import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { runAndGetAppFixture } from './fixtures/startapp.fixture';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { createUserFixture } from './fixtures/createUser.fixture';
import { createJwtFixture } from './fixtures/createJwt.fixture';
import { User } from '../src/shared/interfaces/user.interface';
import { ResponseFormat } from '../src/shared/interfaces/response.interface';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let testUser: User;
  let jwt: string;

  beforeAll(async () => {
    app = await runAndGetAppFixture();
    prismaService = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    testUser = await createUserFixture(prismaService);
    jwt = await createJwtFixture(app, testUser.userId);
  });

  afterEach(async () => {
    await prismaService.user.deleteMany();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  }, 100000);

  describe('signup', function () {
    it('should return a 400 status code when sending invalid data', async function () {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ username: 'badValue', email: 1, password: '' });

      expect(response.statusCode).toBe(400);
    });

    it("should return 'Email must be a gmail account' error message", async function () {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'badValue',
          email: 'fake@hotmail.com',
          password: 'aw151510125',
        });

      expect(response.body.message).toContain('Email must be a gmail account');
    });

    it('should return a valid JWT token', async function () {
      let fakeJwt: string = 'test.test.test';
      jest.spyOn(jwtService, 'sign').mockReturnValue(fakeJwt);
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: Date.now().toString(),
          email: 'fake@gmail.com',
          password: '1234567890#$%',
        });
      const body: ResponseFormat<string> = response.body;
      expect(body.data).toBe(fakeJwt);
      expect(response.statusCode).toBe(201);
    });
  });

  describe('login', function () {
    it('should return a 401 status code for incorrect credentials', async function () {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: testUser.username, password: 'badPassword' });

      expect(response.statusCode).toBe(401);
    });
    it('should return a valid JWT token upon successful authentication', async function () {
      const fakeJwt: string = 'test.test.test';
      jest.spyOn(jwtService, 'sign').mockReturnValue(fakeJwt);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: testUser.username, password: 'hashedPassword' });
      expect(response.body.data).toBe(fakeJwt);
      expect(response.statusCode).toBe(200);
    });
  });
});
