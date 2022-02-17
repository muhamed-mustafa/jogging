import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { v2 as Cloudinary } from 'cloudinary';

declare global
{
    function signup() : { cookie : string; id : string; };
    function MongooseId() : string;
};

global.MongooseId = () =>
{
    return new mongoose.Types.ObjectId().toHexString();
};

let mongo : any;

beforeAll(async () =>
{
    process.env.JWT_KEY = 'asdf';
   
    await Cloudinary.config({
        cloud_name : "microservices",
        api_key    : "811727343751112",
        api_secret : "3jQyDCfSwYO0K2DZUn5P8kyQNlE"
      });

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri ,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as mongoose.ConnectOptions);
});

beforeEach(async () =>
{
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections)
    {
        await collection.deleteMany({});
    };
});

afterAll(async () =>
{
    await mongo.stop();
    await mongoose.connection.close();
});

global.signup = () =>
{
    // Build a JWT payload. => { id , email }
    const payload = { id : global.MongooseId() , email : "test@test.com"};

    // Createe The JWT!
    const token = jwt.sign(payload , process.env.JWT_KEY!);

    // Build session Object. => { jwt : My_JWT }
    const session = { jwt : token };

    // convert session to JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it to base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with the encoded data
    return { cookie : `session=${base64}` , id : payload.id };
}