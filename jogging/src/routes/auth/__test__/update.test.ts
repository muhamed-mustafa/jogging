import { app } from "../../../app";
import request from 'supertest';
import path from 'path';

it('returns a 201 on successful signup and update user info' , async () =>
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

      await request(app)
      .patch('/api/auth/user')
      .set('Cookie' , res.get('Set-Cookie'))
      .field({
          username : "test12test",
          email : "test1@test.com"
      })
      .attach(
        "picture",
        path.join(
          __dirname,
          "testFile",
          "download.png"
          )
      )
      .expect(200);     
});

it('returns a 201 on successful signup and update user info username' , async () =>
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

      await request(app)
      .patch('/api/auth/user')
      .set('Cookie' , res.get('Set-Cookie'))
      .field({
          username : "test12test"
      })
      .expect(200);     
});

it('returns a 400 if the user provides an exists username' , async () =>
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

      await request(app)
      .patch('/api/auth/user')
      .set('Cookie' , res.get('Set-Cookie'))
      .field({
          username : "test1234"
      })
      .expect(400);  
      
    expect(res.body.user.username).toEqual('test1234');
});

it('returns a 400 if the user changes password with the previous one' , async () =>
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

      await request(app)
      .patch('/api/auth/user')
      .set('Cookie' , res.get('Set-Cookie'))
      .field({
        password : 'test@123456',
      })
      .expect(400);     
});

