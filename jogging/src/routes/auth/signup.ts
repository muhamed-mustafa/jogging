import express , { Request , Response } from 'express';
import jwt from 'jsonwebtoken';
import { upload , validationPhoto , BadRequestError , validateUserSignUpData } from '@micro-services1/common';
import { v2 as Cloudinary } from 'cloudinary';
import { User } from '../../models/user.model';

const router = express.Router();

router.post('/api/auth/signup' , upload.fields([{ name : "picture" , maxCount : 1}]) , validationPhoto , validateUserSignUpData , async (req : Request , res : Response) =>
{
        const files = req.files as {[fieldname : string] : Express.Multer.File[]};
        
        const { email , username } = req.body;
        const existingUser = await User.findOne({ email });
        
        if(existingUser)
        {
            throw new BadRequestError('Email in use!');
        }

        const existUsername = await User.findOne({ username });
        if(existUsername)
        {
            throw new BadRequestError('Username is already exists.');
        }

        let user = User.build({ ...req.body });

        if(files.picture)
        {
            await new Promise((resolve , reject) =>
            {
                Cloudinary.uploader.upload_stream({
                    public_id : `picture/jogging-${user.username}`,
                    use_filename : true,
                    tags : `${user.username}-tag`,
                    width : 500,
                    height : 500,
                    crop : "scale",
                    placeholder : true,
                    resource_type : 'auto'
                } , async(err , result) =>
                {
                    if(err)
                    {
                        console.log(err);
                        reject(err);
                    }

                    else
                    {
                        user.picture = result?.secure_url!;
                        resolve(user!.picture)
                    }   
                }).end(files.picture[0].buffer);
            });
        }
        
        await user.save();
        
        // generate JWT and then store it on session object
        const userJwt = jwt.sign({ id : user.id , email : user.email } , process.env.JWT_KEY!);
        req.session   = { jwt : userJwt };

        res.status(201).send({ status : 201 , user , success : true});
});


export { router as signUpRouter };