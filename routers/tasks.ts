import {Router} from "express";
import Task from "../models/Task";
import mongoose, {Types} from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";


const tasksRouter = Router();

tasksRouter.get('/', auth, async (req: RequestWithUser,res,next) => {
    try {
        const tasks = await Task.find({user: req.user?._id});
        res.send(tasks);

    } catch(e) {
        next(e);
    }
});

tasksRouter.put('/:id', auth, async (req: RequestWithUser,res,next) => {
    try {
        let _id: Types.ObjectId;
        try {
            _id = new Types.ObjectId(req.params.id);
        } catch {
            return res.status(404).send({error: 'Wrong ObjectId!'});
        }
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send({error: 'Task Not found!'});
        }
        const newTask = new Task({
            _id: _id,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        });

        if(task.user === req.user?._id) {
            return res.status(403).send({error: 'This task not yours!'});
        }

        res.send(await Task.findByIdAndUpdate(_id, newTask));

    } catch(e) {
        next(e);
    }
});

tasksRouter.delete('/:id', auth, async(req: RequestWithUser,res, next) => {
    try {
        let _id: Types.ObjectId;
        try {
            _id = new Types.ObjectId(req.params.id);
        } catch {
            return res.status(404).send({error: 'Wrong ObjectId!'});
        }
        const task = await Task.findById(_id);

        if(!task) {
            return res.status(404).send({error: 'Task Not found!'});
        }

        if(task.user === req.user?._id) {
            return res.status(403).send({error: 'This task not yours!'});
        }

        const deletedOne = await Task.findByIdAndDelete(_id);

        res.send(deletedOne);

    } catch(e) {
        next(e);
    }
});


tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
    try {
        const task = new Task({
            user: req.user?._id,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        });
        await task.save();
        res.send(task);
    } catch(e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(e);
        }
        next(e);
    }
});

export  default tasksRouter;