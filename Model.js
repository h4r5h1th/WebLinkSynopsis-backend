const mongoose = require('mongoose');

const CreateUser = new mongoose.Schema({
    user: {type: String, required:true, unique:true},
    email: {type: String, required:true, unique:true},
    password: {type: String, required:true},
})

const model = mongoose.model('User_Cred', CreateUser);

module.exports = model;