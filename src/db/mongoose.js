const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',
    {
        userNewUrlParser: true,
        useCreateIndex: true
    }
);

const User = mongoose.model('User', {
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
        minLength: 7,
        validate(value){
            if(value.includes("password")){
                throw new Error("Password cannot contain the password word");
            }
        },
    },
});

const me = new User({name: 'Ivan', age: 35,email: "ivanov.ivan.v@gmail.com", password: "password" });
me.save().then(() => {
    console.log(me);
}).catch(err => {
    console.log({err});
});

const Task = mongoose.model('Task', {
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false,
    }
});
