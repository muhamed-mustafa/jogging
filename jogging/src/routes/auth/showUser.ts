import express , { Request , Response } from 'express';
import { BadRequestError, NotFoundError } from '@micro-services1/common';
import { User } from '../../models/user.model';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/api/auth' , async(req : Request , res : Response) =>
{
      if(!mongoose.Types.ObjectId.isValid(String(req.query.id)))
      {
            throw new BadRequestError('id is invalid')
      };

      if(!req.query.id)
      {
            throw new BadRequestError('id query is required');
      };

      let user = await User.findById(req.query.id);
      if(!user)
      {
          throw new NotFoundError();
      }

      res.status(200).send({ status : 200 , user , success : true });
});

export { router as showUserRouter };