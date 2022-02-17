import { app } from "../../../app";
import request from 'supertest';

it('Report on average speed & distance per week by user.' , async () =>
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
    
    await request(app)
    .post(`/api/task?email=${res.body.user.email}`)
    .set('Cookie' , admin.get('Set-Cookie'))
    .field({
      distance : 10,
      time : 30,
    })
    .expect(201);  

    await request(app)
    .post(`/api/task?email=${res.body.user.email}`)
    .set('Cookie' , admin.get('Set-Cookie'))
    .field({
      distance : 40,
      time : 60,
    })
    .expect(201);   

    const response = await request(app)
    .get(`/api/report`)
    .set('Cookie' , res.get('Set-Cookie'))
    .expect(200)

    expect(response.body.result.totalDistance).toEqual(50)
    expect(response.body.result.averageSpeed).toEqual(0.5555555555555556)
});
