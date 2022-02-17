import { app } from "../../../app";
import request from 'supertest';

it('clears the cookie after signing out' , async () =>
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

    const response = await request(app)
      .post('/api/auth/signout')
      .field({})
      .expect(204)
      
    expect(response.get('Set-Cookie')).toEqual(['session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'])
});