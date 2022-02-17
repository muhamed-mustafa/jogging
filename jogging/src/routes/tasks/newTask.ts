import express , { Request , Response } from 'express';
import { requireAuth , BadRequestError , upload } from '@micro-services1/common';
import { User } from '../../models/user.model';
import { Run } from '../../models/run.model';

const router = express.Router();

router.post('/api/task' , upload.none() , requireAuth , async (req : Request , res : Response) =>
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
        throw new BadRequestError("you don't have permission to add new tasks for users");
    }   
  
    let newTask = Run.build({ ...req.body , userId : user.id });
    await newTask.save();
    res.status(201).send({ status : 201 , newTask , success : true});
});

export { router as newTaskRouter };