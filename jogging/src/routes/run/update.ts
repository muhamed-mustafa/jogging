import express , { Request , Response } from 'express';
import { requireAuth , BadRequestError , NotFoundError ,  upload, NotAuthorizedError } from "@micro-services1/common";
import { Run } from '../../models/run.model';
import _ from 'lodash';
import mongoose from 'mongoose';

const router = express.Router();

router.patch('/api/run' , upload.none() , requireAuth , async (req : Request , res : Response) =>
{
    const run = await Run.findById(req.query.runId);
      
    const { distance , time } = req.body;

    if(distance < 0.1 || time < 0.1)
    {
          for(let i in req.body)
          {
                throw new BadRequestError(`${req.body[i]} must be postive number.`)
          }
    }

   if(!run || !mongoose.Types.ObjectId.isValid(String(req.query.runId)))
   {
      throw new NotFoundError();
   }

   if(run.userId !== req.currentUser!.id)
   {
      throw new NotAuthorizedError();
   }
   
   _.extend(run , req.body);
   await run.save();

   res.status(200).send({ status : 200 , run , success : true});
});

export { router as updateRunRouter };