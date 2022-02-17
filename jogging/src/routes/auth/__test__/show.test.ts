import { app } from "../../../app";
import request from 'supertest';

it('returns a 404 if the userId is not found' , async () =>
{
    const id = global.MongooseId();
    await request(app).get(`/api/auth?id=${id}`)
    .field({})
    .expect(404);
});

it('returns a 200 if the user is found' , async () =>
{
    const res = await request(app)
    .post('/api/auth/signup')
    .field({
        email : 'test@test.com',
        password : 'test@123456',
        username : 'test1234',
        gender : 'male',
    })
    .expect(201);
    
    await request(app).get(`/api/auth?id=${res.body.user.id}`)
    .field({})
    .expect(200);
});
