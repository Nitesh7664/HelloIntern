const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');



//making a connection with database
mongoose.connect('mongodb://localhost/HelloIntern', { useNewUrlParser: true });
mongoose.connection.once('open' , () => {
    console.log('connection created successfully.....');
}).on('error', () => {
    console.log(error);
})


const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(routes);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', './views');



app.listen(3000 , () => {
    console.log('server created successsfully');
});