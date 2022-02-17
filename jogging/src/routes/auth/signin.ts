import express , { Request , Response } from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError, upload } from '@micro-services1/common';
import { Password } from '../../services/Password';
import { User } from '../../models/user.model';

const router = express.Router();

router.post('/api/auth/signin' , upload.none() , async(req : Request , res : Response) =>
{
      const { email , password } = req.body;
      const user = await User.findOne({ email });

      if(!user)
      {
          throw new BadRequestError('Invalid credentials');
      }

      const passwordMatch = await Password.compare(user.password , password);
      if(!passwordMatch)
      {
          throw new BadRequestError('Invalid credentials');
      }

      // generate JWT and then store it on session object
      const userJwt = jwt.sign({ id : user.id , email : user.email} , process.env.JWT_KEY!);
      req.session   = { jwt : userJwt };

      res.status(200).send({ status : 200 , user , success : true });
});

export { router as signinRouter };