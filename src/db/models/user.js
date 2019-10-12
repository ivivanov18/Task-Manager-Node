const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid');
            }
        }
    },
    age:{
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number');
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.includes("password")){
                throw new Error("Password cannot contain the password word");
            }
        },
    },
});

userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcryptjs.hash(user.password,8);
    }
    
    next();
});

const User = mongoose.model('User',userSchema );

module.exports = User;
