/// <reference path="typings/node/node.d.ts"/>
var ex = require('express');
var path = require('path')
var app = ex();

var port = process.env.PORT || 1337;

//setup using jade view engine
app.set('views', path.join(__dirname, 'templates/jade'));
app.set('view engine', 'jade');

//setup stylus middleware
app.use(require('stylus').middleware({src: __dirname + '/templates'
	, dest: __dirname + '/public'}));

//setup static file responses
app.use(ex.static(path.join(__dirname, 'public')))

app.get('/', function (req, res){
	res.render('home', {"message": "HELLO WORLD!"});
});

app.listen(port);