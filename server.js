const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const bodyparser = require('body-parser')
const path = require('path');


const app = express();
mongoose.connect('mongodb://localhost/taylor_database', {useNewUrlParser: true});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const anime =  new Schema({
    id: ObjectId,
    title: String,
    date: Date
});

const Stack = mongoose.model('Stack', anime)

app.get('/stacks', (req, res) => {
    axios.get('https://www.crunchyroll.com/')
    .then(r => {
        const $ = cheerio.load(r.data)
        const animeArr = []
            $('div.name').each((i, elem) =>{
               animeArr.push({
                   title: $(elem).children('a.js-simulcast-series-link').text()
                })     
            })
        
        Stack.create(animeArr)
        res.json(animeArr)
    })
    .catch(e => console.log(e))
});




app.listen(3000, _ => console.log('http://localhost:3000'))