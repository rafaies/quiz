var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');  // importa factoría

// Como las actualizaciones de un recurso deben realizarse en REST con el método PUT de HTTP, se 
// utiliza el convenio methodoverride para encapsularlo como un parámetro oculto en el path
var methodOverride = require('method-override');  

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());  // genera middleware a instalar

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// Quiz 11 paso 3 - moulo 8 página 6
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.urlencoded());
// Pongo a true por aviso
/*
$ foreman start
19:29:28 web.1  | started with pid 3928
19:29:28 web.1  | Fri, 17 Jul 2015 17:29:28 GMT body-parser deprecated undefined extended: provide extended option at app.js:28:20
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));  // Para REST PUT en un POST HTTP
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
	    errors: []	
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []	
    });
});


module.exports = app;
