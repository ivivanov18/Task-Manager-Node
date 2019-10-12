const express = require('express');
const router = new express.Router();
const Task = require('../db/models/task');

router.post('/tasks', (req,res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.status(201).send(task);
    }).catch(err => {
        res.status(400).send(err);
    });
});

router.get("/tasks", (req,res) => {
    Task.find({}).then(tasks => {
        res.send(tasks);
    }).catch(err => {
        res.status(500).send();
    });
});

router.get('/tasks/:id', (req,res) => {
    const _id = req.params.id;
    Task.findById(_id).then(task=> {
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }).catch(err => {
        res.status(500).send();
    });

});

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update =>  allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'});
    }
    try{
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //new: true, runValidators: true});
        const task = await Task.findById(req.params.id);
        updates.forEach((update) => task[update] = req.body[update]);
        if(!task){
            return res.status(404).send();
        }
        task.save();
        res.send(task);
    }catch (e){
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', async(req,res) => {
    try{
        const task = Task.findByIdAndDelete(req.params.id);
        if(!task){
            return res.status(404).send();
        }
        return res.send(task);
    }catch(e){
       return res.status(500).send();
    }
});

module.exports = router;
