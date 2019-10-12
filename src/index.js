const express = require('express');
require('./db/mongoose');

const Task = require('./db/models/task');
const User = require('./db/models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', (req, res) => {
    console.log(req.body);
    const user = new User(req.body);
    user.save().then(() => {
        res.status(201).send(user);
    }).catch(err => {
        res.status(400).send(err);
    });
});

app.get("/users", (req,res) => {
    User.find({}).then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send();
    });
});

app.get('/users/:id', (req,res) => {
    const _id = req.params.id;
    User.findById(_id).then(user => {
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }).catch(err => {
        res.status(500).send();
    });

});

app.post('/tasks', (req,res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.status(201).send(task);
    }).catch(err => {
        res.status(400).send(err);
    });
});

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
