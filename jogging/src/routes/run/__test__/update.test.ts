import { app } from "../../../app";
import request from 'supertest';

it('returns a 404 if the provided id does not exist' , async () =>
{
    const id = global.MongooseId();
    const { cookie } = global.signup();
    await request(app)
      .patch(`/api/run?runId=${id}`)
      .set('Cookie' , cookie)
      .field({ time : 30 , distance : 10 })
      .expect(404);
});


it('returns a 401 if the user does not own the task' , async () =>
{ 
    const { cookie } = global.signup();
    const response = await request(app).post(`/api/run/create`)
      .set('Cookie' , cookie)
      .field({ time : 30 , distance : 10 })
      .expect(201); 
      
    await request(app)
    .patch(`/api/run?runId=${response.body.run.id}`)
    .set('Cookie' , global.signup().cookie)
    .field({ time : 20 , distance : 4 })
    .expect(401);
});
