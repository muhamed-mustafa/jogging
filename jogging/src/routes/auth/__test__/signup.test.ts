import { app } from "../../../app";
import request from 'supertest';
import path from 'path';

it('returns a 201 on successful signup' , async () =>
{
    await request(app)
      .post('/api/auth/signup')
      .field({
          email : 'test@test.com',
          password : 'test@123456',
          username : 'test1234',
          gender : 'male',
      })
      .attach(
        "picture",
        path.join(
          __dirname,
          "testFile",
          "download.png"
          )
      )
      .expect(201);
});

it('returns a 400 with invalid email' , async () =>
{
    await request(app)
      .post('/api/auth/signup')
      .field({
          email : 'test',
          password : 'test@123456',
          username : 'test1234',
          gender : 'male',
      })
      .expect(400);
});

it('returns a 400 with invalid password' , async () =>
{
    await request(app)
      .post('/api/auth/signup')
      .field({
          email : 'test',
          password : '',
          username : 'test1234',
          gender : 'male',
      })
      .expect(400);
});

it('returns a 400 with invalid username' , async () =>
{
    await request(app)
      .post('/api/auth/signup')
      .field({
          email : 'test',
          password : 'test1234@',
          username : 'user',
          gender : 'male',
      })
      .expect(400);
});

it('returns a 400 with invalid gender' , async () =>
{
    await request(app)
      .post('/api/auth/signup')
      .field({
          email : 'test',
          password : 'test1234@',
          username : 'test1234',
          gender : 'm',
      })
      .expect(400);
});

it('disallows duplicate email' , async () =>
{
      await request(app)
      .post('/api/auth/signup')
      .field({
          email : 'test@test.com',
          password : 'test@123456',
          username : 'test1234',
          gender : 'male',
      })
      .expect(201);

      await request(app)
      .post('/api/auth/signup')
      .field({
          email : 'test@test.com',
          password : 'test@123456',
          username : 'test1234',
          gender : 'male',
      })
      .expect(400);
});

it('sets a cookie after successful signup' , async () =>
{
    const response = await request(app)
    .post('/api/auth/signup')
    .field({
        email : 'test@test.com',
        password : 'test@123456',
        username : 'test1234',
        gender : 'male',
    });

    expect(response.get('Set-Cookie')).toBeDefined();
});