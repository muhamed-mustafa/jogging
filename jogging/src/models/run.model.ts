import mongoose from 'mongoose';

interface RunAttrs 
{
    userId : string;
    date : Date;
    distance : number;
    time : number;
};

interface RunDoc extends mongoose.Document
{
    userId : string;
    date : Date;
    distance : number;
    time : number;
    createdAt : string;
    updatedAt : string;
};

interface RunModel extends mongoose.Model<RunDoc>
{
    build(attrs : RunAttrs) : RunDoc;
}

const runSchema = new mongoose.Schema({

    userId : 
    {
        type : String,
        required : true
    },

    date :
    {
        type : Date,
        default : Date.now()
    },

    distance :
    {
        type : Number,
        min : 0.1,
        required : true
    },

    time :
    {
        type : Number,
        min : 0.1,
        required : true,

    },

} , { toJSON : { transform(doc , ret) {ret.id = ret._id , delete ret._id } } , timestamps : { createdAt: 'created_at', updatedAt: 'updated_at' } , versionKey : false});


runSchema.statics.build = (attrs : RunAttrs) =>
{
    return new Run(attrs);
}

const Run = mongoose.model<RunDoc , RunModel>('Run' , runSchema);

export { Run };