const express = require('express');
const User = require('../db/models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

/**
 * Create user
 */
router.post('/users',async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save();
        const token = await user.generateAuthToken();
        return res.status(201).send({user, token});
    }catch(e){ 
        return res.status(400).send(e);
    }
});

router.post('/users/login',async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        return res.send({user, token});
    }catch(e){
        return res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();
        return res.send();
    }catch(e){
        return res.status(500).send();
    } 

});

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        return res.send();
    }catch(e){
        return res.status(500).send();
    }
});

router.get("/users/me", auth, (req,res) => {
    return res.send(req.user);
});

router.get('/users/:id', auth, (req,res) => {
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

router.patch('/users/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every(update =>  allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'});
    }
    try{
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //new: true, runValidators: true});
        const user = await User.findById(req.body.id);
        updates.forEach((update)=>user[update] = req.body[update]);
        await user.save();
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch (e){
        res.status(400).send(e);
    }
});

router.delete('/users/:id', auth, async (req,res) => {
    try{
        const user = User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).send();
        }
        return res.send(user);
    }catch(e){
       return res.status(500).send();
    }
});

module.exports = router;
