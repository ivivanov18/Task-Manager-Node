const express = require('express');
const router = new express.Router();
const Task = require('../db/models/task');
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req,res) => {
    //const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    });
    try{
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(err);
    }
});

router.get("/tasks",auth, async (req,res) => {
    try{
        // Code qui marche aussi
        // await req.user.populate('userTasks').execPopulate();
        const tasks = await Task.find({owner: req.user._id});
        if(tasks.length === 0){
            return res.status(404).send();
        }
        return res.send(tasks);
    }catch(e){
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;

    try{
        const task = await Task.findOne({_id, owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(500).send();
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update =>  allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'});
    }
    try{
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //new: true, runValidators: true});
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update]);
        task.save();
        res.send(task);
    }catch (e){
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id',auth,  async(req,res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }
        return res.send(task);
    }catch(e){
       return res.status(500).send();
    }
});

module.exports = router;
