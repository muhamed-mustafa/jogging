import express , { Request , Response } from 'express';
import { BadRequestError , requireAuth , upload } from '@micro-services1/common';
import { User } from '../../models/user.model';
import { Run } from '../../models/run.model';

const router = express.Router();

router.get('/api/report/role' , upload.none() , requireAuth , async (req : Request , res : Response) =>
{
      const { email } = req.query;
      if(!email)
      {
          throw new BadRequestError('email query is required');
      }

      let user = await User.findOne({ email });
      if(!user)
      {
          throw new BadRequestError('user is not found!');
      }

      let currentUser = await User.findById(req.currentUser!.id);
      if(currentUser?.roles === 'user')
      {
        throw new BadRequestError("you don't have permission to show reports for users");
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

export { router as reportTasksRouterByRole };