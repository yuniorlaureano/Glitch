var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');


var app = express();
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var data = [
    {
        nombre: "Primera base",
        posicion: "Catcher",
        equipo: "Rojos"
    },
    {
        nombre: "Segunda base",
        posicion: "Joey Votto",
        equipo: "Cachorros"
    },
    {
        nombre: "Campocorto",
        posicion: "José Altuve",
        equipo: "Astros"
    },
    {
        nombre: "Willson Contreras",
        posicion: "Corey Seager",
        equipo: "Dodgers"
    }
];

var publicPath = path.resolve(__dirname + '/');

app.use(express.static(publicPath));

app.get('/data', (req, res) => {
    res.status(200);
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
});

app.post('/data', (req, res) => {
    res.status(200);
    res.set('Content-Type', 'application/json');
    data.push(req.body);
    res.end(JSON.stringify(data));
});

app.use((req, res)=>{
    res.statusCode = 404;
    res.end('404!!');
});

app.listen(3000, ()=>{
    console.log('server running');
});
