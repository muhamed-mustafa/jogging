import request from 'supertest';
import { app } from '../../../app';
import { Run } from '../../../models/run.model';

it('create a task with valid inputs' , async () =>
{
    const { cookie , id : userId } = global.signup();
    await request(app)
    .post('/api/run/create')
    .set('Cookie' , cookie)
    .field({ userId : userId , time : 20 , distance : 2 })
    .expect(201);

    let tasks = await Run.find({});
    expect(tasks.length).toEqual(1);
    expect(tasks[0].time).toEqual(20);
    expect(tasks[0].distance).toEqual(2);
}); 

it('create a task with invalid distance' , async () =>
{
    const { cookie , id : userId } = global.signup();
    await request(app)
    .post('/api/run/create')
    .set('Cookie' , cookie)
    .field({ userId : userId , time : 20 , distance : -2 })
    .expect(400);
}); 

it('create a task with invalid time' , async () =>
{
    const { cookie , id : userId } = global.signup();
    await request(app)
    .post('/api/run/create')
    .set('Cookie' , cookie)
    .field({ userId : userId , time : -20 , distance : 2 })
    .expect(400);
}); 