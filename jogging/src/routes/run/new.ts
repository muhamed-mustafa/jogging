import express , { Request , Response } from 'express';
import { requireAuth , BadRequestError , upload } from "@micro-services1/common";
import { Run } from '../../models/run.model';

const router = express.Router();

router.post('/api/run/create' , upload.none() , requireAuth , async (req : Request , res : Response) =>
{

      const { distance , time } = req.body;

      if(distance < 0.1 || time < 0.1)
      {
            for(let i in req.body)
            {
                  throw new BadRequestError(`${req.body[i]} must be postive number.`)
            }
      }

      const run = Run.build({ ...req.body , userId : req.currentUser!.id });

      await run.save();

      res.status(201).send({ status : 201 , run , success : true});
});

export { router as createRunRouter };