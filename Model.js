const mongoose = require('mongoose');

const Data_Schema = new mongoose.Schema({
    url: {type: String},
    data: {type: String},
})

const CreateUser = new mongoose.Schema({
    user: {type: String, required:true, unique:true},
    email: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    Saved_data: [Data_Schema],
})

const model = mongoose.model('User_Cred', CreateUser);

module.exports = model;