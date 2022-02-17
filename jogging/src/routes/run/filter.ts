import express , { Request , Response } from 'express';
import { BadRequestError, requireAuth } from "@micro-services1/common";
import { Run } from '../../models/run.model';
import { User } from '../../models/user.model';

const router = express.Router();

router.get('/api/run/filter' , requireAuth , async (req : Request , res : Response) =>
{
      let from   = req.query.from;
      let to     = req.query.to;

      if(!from)
      {
            throw new BadRequestError('from field is required');
      }

      if(!to)
      {
            throw new BadRequestError('to field is required');
      }
      
      let currentUser = await User.findById(req.currentUser!.id);      

      const runData = await Run.find({userId : currentUser!.id});
      
      let data = runData.filter(data => { return new Date(data.date) >= new Date(String(from)) && new Date(data.date) <= new Date(String(to))});
          
      res.status(200).send({ status : 200 , data , success : true});
});

export { router as filterByDate };