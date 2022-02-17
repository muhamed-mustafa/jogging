import { Password } from "../services/Password";
import mongoose from 'mongoose';
import { GenderType , RoleType } from '@micro-services1/common';

interface UserAttrs 
{
    username : string;
    email : string;
    password : string;
    gender : GenderType;
    picture? : string;
    roles? : string;
};

interface UserDoc extends mongoose.Document
{
    email : string;
    username : string;
    password : string;
    gender : GenderType;
    picture  : string;
    roles : string;
    createdAt : string;
    updatedAt : string;
};

interface UserModel extends mongoose.Model<UserDoc>
{
    build(attrs : UserAttrs) : UserDoc;
}

const userSchema = new mongoose.Schema({
      username :
      {
          type : String,
          required : true,
          trim : true,
          unique : true,
          minlength : [8 , "Username must be more than 8 characters"],
          max : 20,
          lowercase : true
      },

      email :
      {
          type : String,
          required : true,
          trim : true,
          unique : true,
          max : 50,
          lowercase : true
      },

      password :
      {
          type : String,
          required : true,
          minlength : [8 , "Password must be more than 8 characters"]
      },

      gender :
      {            
          type : String,
          required : true,
          trim : true,
          lowercase : true,
          enum : Object.values(GenderType),
          default : ""
      },

      picture :
      {
          type : String,
          default : "",
      },

      roles :
      {
        type : String,
        trim : true,
        enum : Object.values(RoleType),
        default : "user"
      }

} , { toJSON : { transform(doc , ret) {ret.id = ret._id , delete ret._id , delete ret.password; } } , timestamps : { createdAt: 'created_at', updatedAt: 'updated_at' } , versionKey : false});

userSchema.pre('save' , async function(done)
{
    if(this.isModified('password'))
    {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password' , hashed);
    };

    done();
});

userSchema.statics.build = (attrs : UserAttrs) =>
{
    return new User(attrs);
}

const User = mongoose.model<UserDoc , UserModel>('User' , userSchema);

export { User };