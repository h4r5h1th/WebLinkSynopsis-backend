const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const CreateUser = require('./Model');
const { ObjectId } = require('mongodb')

//middleware
app.use(cors())
app.use(bodyParser.json());
require('dotenv').config();

//Connect to Server
async function mongoConnect(){
  await mongoose.connect('mongodb://127.0.0.1:27017/WebSummarize', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

mongoConnect().catch(err => console.log(err));

//SignUp api

app.post('/api/signup', async (req , res) =>{
  if(await CreateUser.findOne({email: req.body.email})){
    res.send("Email exists");
  }
  else if(await CreateUser.findOne({user: req.body.user})){
    res.send("Username Already exists")
  }
  else{
    try{
      await CreateUser.create({
        user: req.body.user,
        email :  req.body.email,
        password : req.body.password
      })
      res.send("Success");
    }
    catch(err){
      res.body("error");
      console.log(err);
    }
  }
})

//signIn api
app.post('/api/login', async (req , res) =>{
  const User_Check = await CreateUser.findOne({email: req.body.email});
  if(User_Check){
    if(User_Check.password===req.body.password){
      res.send({data: 'Correct', userName: User_Check.user})
    }else{
      res.send({data: "Incorrect Password"});
    }
  }else{
    res.send({data: "Given email doesn't have an account!"})
  }
})

//Save data to DB
app.post('/api/save_data', async(req, res) =>{
  try{
    const Find_user =  await CreateUser.findOne({user: req.body.user});
    if(!Find_user) res.send('User Not Found!');
    Find_user.Saved_data.push({url:req.body.urllink, data: req.body.data_text.data})
    await Find_user.save();
    res.send("Data received")
  }catch(err){
    console.log(err);
    res.send("Something went wrong!")
  }
})

//get data from DB
app.post('/api/get_data_saved', async(req, res) =>{
  try{
    const data =  await CreateUser.findOne({user: req.body.user})
    if(!data) res.send('User Not Found!');
    res.send({data: data.Saved_data, status: "ok"})
  }catch(err){
    console.log(err);
    res.send({status: "Something went wrong!"})
  }
})

//delete saved element

app.post('/api/delete/saved', async(req, res) =>{
  try{
    await CreateUser.updateOne({user: req.body.user}, {$pull: {Saved_data: {_id: new ObjectId(req.body.id)}}});
  }catch(err){
    console.log(err);
    res.send({status: "Something went wrong!"})
  }
})

//summary api methods and keys
let options = {
  method: 'GET',
  url: 'https://article-extractor-and-summarizer.p.rapidapi.com/summarize',
  params: {
    url: '',
    length: '3'
  },
  headers: {
    'X-RapidAPI-Key': process.env.API_KEY,
    'X-RapidAPI-Host': process.env.API_HOST
  }
};

app.post('/summary', (req, res) => {
  options.params.url = req.body.urllink
  async function GetData(){
    try {
      const response = await axios.request(options);
      res.send(response.data.summary);
        } catch (error) {
            console.log(error);
            res.send(error.response)
        }
    }
    GetData();
})

//dummy code
app.get('/', (req, res) =>{
  res.send("Working")
})

app.listen(3001, ()=> console.log("Connection Successful at Port 3001"))