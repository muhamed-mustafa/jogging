import { app } from "../../../app";
import request from 'supertest';

it('create a tasks with valid inputs and filter them' , async () =>
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
    
    const task1 = await request(app)
    .post('/api/run/create')
    .set('Cookie' , res.get('Set-Cookie'))
    .field({ userId : res.body.user.id , time : 20 , distance : 2 })
    .expect(201);
    
    const date = new Date(task1.body.run.date);
    const newDate = `${date.getFullYear()}-${(date.getMonth()+1)}-${date.getDate()}`;
    const incOneDay = new Date(date.setDate(date.getDate() + 1));
    const incTwoDay = new Date(date.setDate(date.getDate() + 2));    
    let from = newDate;
    let to   = `${incOneDay.getFullYear()}-${(incOneDay.getMonth()+1)}-${incOneDay.getDate()}`;

    await request(app)
    .post('/api/run/create')
    .set('Cookie' , res.get('Set-Cookie'))
    .field({ userId : res.body.user.id , time : 10 , distance : 1 })
    .expect(201);

    await request(app)
    .post('/api/run/create')
    .set('Cookie' , res.get('Set-Cookie'))
    .field({ userId : res.body.user.id , time : 10 , distance : 1 , date : `${incTwoDay.getFullYear()}-${(incTwoDay.getMonth()+1)}-${incTwoDay.getDate()}` })
    .expect(201);
   
    const filterTasks = await request(app)
    .get(`/api/run/filter?from=${from}&to=${to}`)
    .set('Cookie' , res.get('Set-Cookie'))
    .expect(200)   

    expect(filterTasks.body.data.length).toEqual(2);
}); 