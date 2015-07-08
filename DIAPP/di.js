/// <reference path="typings/node/node.d.ts"/>
var ex = require('express');
var path = require('path')
var app = ex();

//setup using jade view engine
app.set('views', path.join(__dirname, 'templates/jade'));
app.set('view engine', 'jade');

//setup stylus middleware
app.use(require('stylus').middleware({src: path.join(__dirname, 'templates/stylus')
	, dest: path.join(__dirname, 'public/styles')}));

//setup static file responses
app.use(ex.static(path.join(__dirname, 'public')))

app.get('/', function (req, res){
	res.render('home', {"message": "HELLO WORLD!"});
});

app.listen(process.argv[2]);