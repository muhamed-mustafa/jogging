import { app } from "../../../app";
import request from 'supertest';

it('returns a 200 if the currentUser is deleted by admin or manager' , async () =>
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

    const userOne = await request(app)
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
    .delete(`/api/auth/role?id=${userOne.body.user.id}`)
    .set('Cookie' , admin.get('Set-Cookie'))
    .field({})
    .expect(200);
});

it('returns a 400 if the currentUser is deleted by default user' , async () =>
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

    const userOne = await request(app)
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
    .delete(`/api/auth/role?id=${userOne.body.user.id}`)
    .set('Cookie' , global.signup().cookie)
    .field({})
    .expect(400);
});