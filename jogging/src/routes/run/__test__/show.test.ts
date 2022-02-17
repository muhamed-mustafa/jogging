import { app } from "../../../app";
import request from 'supertest';

it('returns a 404 if the task is not found' , async () =>
{
    const id = global.MongooseId();
    const { cookie } = global.signup();
    await request(app).get(`/api/run?runId=${id}`)
    .set('Cookie' , cookie)
    .expect(404);
});

it('returns the task if the task is found' , async () =>
{
    const { cookie , id : userId } = global.signup();

    const response = await request(app).post('/api/run/create')
    .set('Cookie' , cookie)
    .field({ userId : userId , time : 20 , distance : 10 })
    .expect(201);    
    
    const taskResponse = await request(app).get(`/api/run?runId=${response.body.run.id}`)
    .set('Cookie' , cookie)
    .expect(200);

    expect(taskResponse.body.run.time).toEqual(20);
    expect(taskResponse.body.run.distance).toEqual(10);
});
