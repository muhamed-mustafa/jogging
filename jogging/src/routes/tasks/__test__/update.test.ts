import { app } from "../../../app";
import request from 'supertest';

it('returns a 200 if the task is added successfully to user by admin and update it' , async () =>
{ 
    const admin = await request(app)
    .post('/api/auth/signup')
    .field({
        email : 'test@test.com',
        password : 'test@123456',
        username : 'testone1',
        gender : 'male',
        roles   : 'admin'
    })
    .expect(201);

    const res = await request(app)
    .post('/api/auth/signup')
    .field({
        email : 'test1@test.com',
        password : 'test@123456',
        username : 'testtwo2',
        gender : 'male',
        roles   : 'user'
    })
    .expect(201);
    
    const task = await request(app)
    .post(`/api/task?email=${res.body.user.email}`)
    .set('Cookie' , admin.get('Set-Cookie'))
    .field({
      distance : 10,
      time : 30,
    })
    .expect(201);  

   
    await request(app)
    .patch(`/api/task?email=${res.body.user.email}&id=${task.body.newTask.id}`)
    .set('Cookie' , admin.get('Set-Cookie'))
    .field({
      distance : 40,
      time : 100,
    })
    .expect(200);  
});