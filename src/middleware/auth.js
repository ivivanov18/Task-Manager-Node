const jwt = require('jsonwebtoken');
const User = require('../db/models/user');

const auth = async (req, res, next) => {
    console.log("auth");
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisisasecretsecret');
        const user = await User.findOne({_id:decoded._id, 'tokens.token': token});

        if(!user){
            throw new Error();
        }
        req.user = user;
    }catch(e){
        return res.status(401).send({error: 'Please authenticate'});
    }
    next();
};

module.exports = auth;
