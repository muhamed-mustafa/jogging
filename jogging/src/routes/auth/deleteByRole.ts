import express , { Request , Response } from 'express';
import { BadRequestError, requireAuth } from '@micro-services1/common';
import { User } from '../../models/user.model';
import mongoose from 'mongoose';

const router = express.Router();

router.delete('/api/auth/role' , requireAuth ,  async(req : Request , res : Response) =>
{
      if(!mongoose.Types.ObjectId.isValid(String(req.query.id)))
      {
            throw new BadRequestError('id is invalid')
      };

      if(!req.query.id)
      {
            throw new BadRequestError('id query is required');
      };

      let user = await User.findById(req.currentUser!.id);
      if(!user)
      {
          throw new BadRequestError('there is no users.');
      }

      if(user.roles === 'user')
      {
          throw new BadRequestError("you don't have permission to delete users");
      }

      user = await User.findByIdAndDelete(req.query.id);
      if(!user)
      {
          throw new BadRequestError('user not found!');
      }

      res.send({ status : 200 , message : "Successfully deleted user." , success : true });
});

export { router as deleteUserRouter };