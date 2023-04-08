import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { RoomCreateDto } from './dto/create.dto';
import { e2e } from 'pactum'

describe('Rooms (e2e)', () => {
    let app: INestApplication;
    let Authorization = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU4MjQ5MjczMzE3OCwiaWF0IjoxNjU5MjUzMTk5LCJleHAiOjE2NTk4NTc5OTl9.SvgHat4Y8OMkeD0X1VXuRx-L-sdBqtyzWALEMnVrtHE'
    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });


    describe('create', () => {
        let input: RoomCreateDto = new RoomCreateDto()
        input.name = 'TEST';
        input.isPublic = false

        let url = '/rooms'

        it('should return status code 401 for Auth', async () => {
            return await request(app.getHttpServer())
                .post(url)
                .send(input)
                .expect(401)
        })

        it('should return status code 400 when name is empty', async () => {
            input.name = null
            return await request(app.getHttpServer())
                .post(url)
                .send(input)
                .set('Authorization', Authorization)
                .expect(400)
        })

        it('should create Room and return RoomId', async () => {
            const response = await request(app.getHttpServer())
                .post(url)
                .send(input)
                .set('Authorization', Authorization)
            expect(response.statusCode).toBe(201)
            expect(typeof response.body.data.roomId).toBe("number")
            //Todo: remove by RoomId
        })

    })


    afterAll(async () => {
        await app.close();
    });
});