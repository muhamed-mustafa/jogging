import express , { Request , Response } from 'express';

const router = express.Router();

router.post('/api/auth/signout' , (req : Request , res : Response) =>
{
    req.session = null;
    res.status(204).send({ message : "you signOut Successfully..." , succees : true});
});

export { router as signoutRouter };