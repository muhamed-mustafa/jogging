import { app } from "../../../app";
import request from 'supertest';

it('returns a 201 if the task is added successfully to user by admin' , async () =>
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

    const userOne = await request(app)
    .post('/api/auth/signup')
    .field({
        email : 'test1@test.com',
        password : 'test@123456',
        username : 'testtwo2',
        gender : 'male',
        roles   : 'user'
    })
    .expect(201);
    
    await request(app)
    .post(`/api/task?email=${userOne.body.user.email}`)
    .set('Cookie' , admin.get('Set-Cookie'))
    .field({
      distance : 10,
      time : 30,
    })
    .expect(201);   
});


it('returns a 400 if the task is added to user is not exist' , async () =>
{ 
    await request(app)
    .post('/api/auth/signup')
    .field({
        email : 'test@test.com',
        password : 'test@123456',
        username : 'testone1',
        gender : 'male',
        roles : 'user'
    })
    .expect(201);
    
    await request(app)
    .post(`/api/task?email=test`)
    .set('Cookie' , global.signup().cookie)
    .field({
      distance : 10,
      time : 30,
    })
    .expect(400);   
});

it('returns a 400 if the task is added to user by default user' , async () =>
{
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
    
    await request(app)
    .post(`/api/task?email=${res.body.user.email}`)
    .set('Cookie' , res.get('Set-Cookie'))
    .field({
      distance : 10,
      time : 30,
    })
    .expect(400);   
});
