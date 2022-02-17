import express , { Request , Response } from 'express';
import { requireAuth , BadRequestError , upload } from '@micro-services1/common';
import { User } from '../../models/user.model';
import _ from 'lodash';
import { Run } from '../../models/run.model';
import mongoose from 'mongoose';

const router = express.Router();

router.patch('/api/task' , upload.none() , requireAuth , async (req : Request , res : Response) =>
{
    const { email , id } = req.query;
    if(!email)
    {
        throw new BadRequestError('email query is required');
    }

    if(!mongoose.Types.ObjectId.isValid(String(id)))
    {
        throw new BadRequestError('id is invalid...');
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


    let task = await Run.findById(id);
    if(!task)
    {
        throw new BadRequestError('there is no task');
    }
    
    _.extend(task , req.body);
    await task.save();

    res.status(200).send({ status : 200 , task , success : true});
});

export { router as updateTaskRouter };