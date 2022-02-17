import { app } from "../../../app";
import request from 'supertest';

it('returns a 404 if the task is not found' , async () =>
{
    const id = global.MongooseId();
    await request(app).delete(`/api/run?runId=${id}`)
    .set('Cookie' , global.signup().cookie)
    .expect(404);
});

it('create the task and deleted it' , async () =>
{
    const { cookie , id : userId } = global.signup();

    const response = await request(app).post('/api/run/create')
    .set('Cookie' , cookie)
    .field({ userId : userId , time : 20 , distance : 10 })
    .expect(201);    

    const takeResponse = await request(app)
    .delete(`/api/run?runId=${response.body.run.id}`)
    .set('Cookie' , cookie)
    .expect(200)
    
    expect(takeResponse.body.message).toEqual('Task has been deleted Successfully!')
});

it('create the task and return an Authorized if the task not belong to the currentUser' , async () =>
{
    const { cookie , id : userId } = global.signup();

    const response = await request(app).post('/api/run/create')
    .set('Cookie' , cookie)
    .field({ userId : userId , time : 20 , distance : 10 })
    .expect(201);    

     await request(app)
    .delete(`/api/run?runId=${response.body.run.id}`)
    .set('Cookie' , global.signup().cookie)
    .expect(401)
});
