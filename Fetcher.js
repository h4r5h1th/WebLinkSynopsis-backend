const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

require('dotenv').config();

console.log(process.env.API_HOST);

async function mongoConnect(){
  await mongoose.connect('mongodb://localhost:27017/WebSummarize', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

mongoConnect().catch(err => console.log(err));

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

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST'
}))

app.use(bodyParser.json());

app.get('/', (req, res) =>{
  res.send("Working")
})

app.post('/summary', (req, res) => {
    options.params.url = req.body.urllink
    async function GetData(){
        try {
            const response = await axios.request(options);
            console.log(response.data);
            res.send(response.data.summary);
        } catch (error) {
            console.log(error);
            res.send(error.response.data.message)
        }
    }
    GetData();
})

app.listen(3001, ()=> console.log("Connection Successful at Port 3001"))