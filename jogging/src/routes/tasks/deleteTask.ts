import express , { Request , Response } from 'express';
import { requireAuth , BadRequestError , upload } from '@micro-services1/common';
import { User } from '../../models/user.model';
import { Run } from '../../models/run.model';
import mongoose from 'mongoose';

const router = express.Router();

router.delete('/api/task' , upload.none() , requireAuth , async (req : Request , res : Response) =>
{
    const { id } = req.query;
    if(!id)
    {
        throw new BadRequestError('id query is required');
    }

    if(!mongoose.Types.ObjectId.isValid(String(id)))
    {
        throw new BadRequestError('id is invalid...');
    }

    let currentUser = await User.findById(req.currentUser!.id);
    if(currentUser?.roles === 'user')
    {
        throw new BadRequestError("you don't have permission to add new tasks for users");
    }   

    let task = await Run.findByIdAndDelete(id);
    if(!task)
    {
        throw new BadRequestError('task is not exists...');
    }

    res.send({ status : 204 , message : "Successfully Deleted Task.." , success : true});
});

export { router as deleteTaskRouter };