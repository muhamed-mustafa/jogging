import express , { Request , Response } from 'express';
import { requireAuth , upload, NotFoundError } from "@micro-services1/common";
import { Run } from '../../models/run.model';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/api/run' , upload.none() , requireAuth , async (req : Request , res : Response) =>
{
    const run = await Run.findById(req.query.runId);
      
     if(!run || !mongoose.Types.ObjectId.isValid(String(req.query.runId)))
     {
         throw new NotFoundError();
     }

     res.status(200).send({ status : 200 , run , success : true});
});

export { router as showRunRouter };
