import express , { Request , Response } from 'express';
import { BadRequestError, NotFoundError , requireAuth } from '@micro-services1/common';
import { User } from '../../models/user.model';

const router = express.Router();

router.get('/api/auth/role' , requireAuth ,  async(req : Request , res : Response) =>
{
      let user = await User.findById(req.currentUser!.id);
      if(!user)
      {
          throw new NotFoundError();
      }

      if(user.roles === 'user')
      {
          throw new BadRequestError("you don't have permission to show users");
      }

      let users = await User.find({});
      if(users.length === 0)
      {
          throw new BadRequestError('there is no users.');
      }

      let filterUsers = users.filter(user => { return user.roles !== 'admin'})
            
      res.status(200).send({ status : 200 , filterUsers , success : true });
});

export { router as showUsersRouter };