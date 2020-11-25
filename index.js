const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const visitorRouter = require('../lproject/routers/visitor-router')
const organizerRouter = require('../lproject/routers/organizer-router');
const eventRouter = require('../lproject/routers/event-router')

app.use(bodyParser.json());

app.use('/', visitorRouter);
app.use('/', organizerRouter);
app.use('/', eventRouter);

mongoose.connect('mongodb+srv://kekemperor:winnerman@lproject.zhitj.mongodb.net/lproject?retryWrites=true&w=majority', { useNewUrlParser: true });
mongoose.connection
    .once('open', () => console.log('Good to go!'))
    .on('error', (error) => {
        console.warn('Warning', error);
    });

app.listen(30030, () => {
    console.log('app is running ^_^')
})