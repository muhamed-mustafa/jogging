import express , { Request , Response } from 'express';
import { requireAuth , upload , NotAuthorizedError, NotFoundError } from "@micro-services1/common";
import { Run } from '../../models/run.model';

const router = express.Router();

router.delete('/api/run' , upload.none() , requireAuth , async (req : Request , res : Response) =>
{
    const run = await Run.findById(req.query.runId);
      
     if(!run)
     {
         throw new NotFoundError();
     }

     if(run.userId !== req.currentUser!.id)
     {
        throw new NotAuthorizedError();
     }

     await run.deleteOne();
     res.send({ status : 200 ,  message : "Task has been deleted Successfully!"  , success : true});
});

export { router as deleteRunRouter };