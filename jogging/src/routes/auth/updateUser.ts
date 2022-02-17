import express , { Request , Response } from 'express'
import { requireAuth , validationPhoto , upload, BadRequestError } from '@micro-services1/common';
import { v2 as Cloudinary } from 'cloudinary';
import { User } from '../../models/user.model';
import _ from 'lodash';
import { Password } from '../../services/Password';

const router = express.Router();

router.patch('/api/auth/user' , upload.fields([{name : "picture" , maxCount : 1}]) , requireAuth , validationPhoto  , async(req : Request , res : Response ) =>
{
        const user = await User.findById(req.currentUser!.id);

        if(!user)
        {
            throw new BadRequestError("User is not found!");
        }

        if (req.body.username)
        {
            const existingUserName = await User.findOne({ username: req.body.username });

            if (existingUserName) 
            {
                throw new BadRequestError("username already exists");
            }

            user.username = req.body.username;
        }

        if (req.body.email) 
        {
            const existingEmail = await User.findOne({ email: req.body.email });

            if (existingEmail)
            {
                throw new BadRequestError("Email already exists");
            }

            user.email = req.body.email;
        }

        if(req.body.password)
        { 
            const specialCharactersValidator = /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
            if(req.body.password.includes('password') || req.body.password.includes('asdf') || req.body.password.length < 8)
            {
                throw new BadRequestError('Password is too week.');
            }

            if(!specialCharactersValidator.test(req.body.password))
            {
                throw new BadRequestError('Password must contain a special character.');
            }


            let isTheSamePassword = await Password.compare(user.password , req.body.password);

            if (isTheSamePassword) 
            {
                throw new BadRequestError("Can not change password with the previous one");
            }

            user.password = req.body.password;
        }

        const files = req.files as {[fieldname : string] : Express.Multer.File[]};

        if(files.picture)
        {
            await new Promise((resolve , reject) =>
            {
                Cloudinary.uploader.upload_stream({
                    public_id : `profile-picture/social-${user.username}`,
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

        _.extend(user , req.body);
        await user.save();
        res.status(200).send({ status : 200 , user , success : true });
});

export { router as updatedUser };