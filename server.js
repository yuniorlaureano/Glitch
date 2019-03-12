var express = require('express');
var path = require('path');
var http = require('http');

var app = express();

var publicPath = path.resolve(__dirname + '/');
app.use(express.static(publicPath));

app.get('/data', (req, res) => {
    res.status(200);
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify([
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
    ]));
});

app.use((req, res)=>{
    res.statusCode = 404;
    res.end('404!!');
});

app.listen(3000, ()=>{
    console.log('server running');
});
