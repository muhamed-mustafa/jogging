import { app } from "../../../app";
import request from 'supertest';

it('returns a 200 if the users is found' , async () =>
{ 
    const admin = await request(app)
    .post('/api/auth/signup')
    .field({
        email : 'test@test.com',
        password : 'test@123456',
        username : 'test1234',
        gender : 'male',
        roles   : 'admin'
    })
    .expect(201);

    await request(app)
    .post('/api/auth/signup')
    .field({
        email : 'test1@test.com',
        password : 'test@123456',
        username : 'test21234',
        gender : 'male',
        roles   : 'user'
    })
    .expect(201);

    await request(app)
    .post('/api/auth/signup')
    .field({
        email : 'test4@test.com',
        password : 'test@123456',
        username : 'test1manager',
        gender : 'male',
        roles   : 'manager'
    })
    .expect(201);
    
    const res = await request(app)
    .get('/api/auth/role')
    .set('Cookie' , admin.get('Set-Cookie'))
    .expect(200)

    expect(res.body.filterUsers.length).toEqual(2);
});

