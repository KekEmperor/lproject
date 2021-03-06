const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const visitorRouter = require('./routers/visitor-router')
const organizerRouter = require('./routers/organizer-router');
const eventRouter = require('./routers/event-router');
const adminRouter = require('./routers/admin-router');

app.use(bodyParser.json());

app.use(cors());

app.use('/', visitorRouter);
app.use('/', organizerRouter);
app.use('/', eventRouter);
app.use('/', adminRouter);

mongoose.connect('mongodb+srv://kekemperor:winnerman@lproject.zhitj.mongodb.net/lproject?retryWrites=true&w=majority', { useNewUrlParser: true });
mongoose.connection
    .once('open', () => console.log('Good to go!'))
    .on('error', (error) => {
        console.warn('Warning', error);
    });

app.listen(30030, () => {
    console.log('app is running ^_^')
})