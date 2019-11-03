const express = require('express');
const multer = require('multer');
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

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every(update =>  allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'});
    }
    try{
        updates.forEach((update)=>req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    }catch (e){
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth, async (req,res) => {
    try{
        /*const user = User.findByIdAndDelete(req.user._id);
        if(!user){
            return res.status(404).send();
        }*/
        await req.user.remove();
        return res.send();
    }catch(e){
       return res.status(500).send();
    }
});

const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a Word document'));
        }
        cb(undefined, true);
    }
});

router.post('/users/me/upload', upload.single('avatar'), async (req, res) => {
    res.send();    
});
module.exports = router;
