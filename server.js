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
        id: 1,
        nombre: "Primera base",
        posicion: "Catcher",
        equipo: "Rojos",
        homerun: 20
    },
    {
        id: 2,
        nombre: "Segunda base",
        posicion: "Joey Votto",
        equipo: "Cachorros",
        homerun: 50
    },
    {
        id: 3,
        nombre: "Campocorto",
        posicion: "José Altuve",
        equipo: "Astros",
        homerun: 30
    },
    {
        id: 4,
        nombre: "Willson Contreras",
        posicion: "Corey Seager",
        equipo: "Dodgers",
        homerun: 10
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
    data.push({
        ...req.body,
        id: data.length + 1
    });    
    res.end(JSON.stringify(data));
});

app.delete('/data/:id', (req, res) => {
    res.status(200);
    res.set('Content-Type', 'application/json');

    data = data.filter(function(item){
        return item.id != req.params.id;
    });

    res.end(JSON.stringify(data));
});

app.put('/data/:id', (req, res) => {
    res.status(200);
    res.set('Content-Type', 'application/json');

    data = data.filter(function(item){
        return item.id != req.params.id;
    });

    data.push({
        ...req.body,
        id: req.params.id
    });   

    res.end(JSON.stringify(data));
});

app.use((req, res)=>{
    res.statusCode = 404;
    res.end('404!!');
});

app.listen(3000, ()=>{
    console.log('server running: ' + 3000);
});
