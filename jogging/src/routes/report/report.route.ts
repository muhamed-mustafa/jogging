import express , { Request , Response } from 'express';
import { BadRequestError , requireAuth , upload } from '@micro-services1/common';
import { User } from '../../models/user.model';
import { Run } from '../../models/run.model';

const router = express.Router();

router.get('/api/report' , upload.none() , requireAuth , async (req : Request , res : Response) =>
{
      let user = await User.findById(req.currentUser!.id);
      if(!user)
      {
          throw new BadRequestError('user is not found!');
      }

      let activityDate = await Run.find({ userId : user.id }) , result;

      if(activityDate.length > 0)
      {
          let activity = activityDate.reduce((total , current) =>
          {
              total.distance += current.distance;
              total.time     += current.time;
              return total;
          } , {distance : 0 , time : 0});

          result = { totalDistance : activity.distance , averageSpeed : activity.distance / activity.time};
      };

      res.status(200).send({ status : 200 , result , success : true});
});

export { router as reportTasksRouter };