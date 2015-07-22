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
// Se importa el paquete express-session instalado con npm
var session = require('express-session');

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
//app.use(cookieParser());
app.use(cookieParser('Quiz 2015')); //añadir semilla ‘Quiz 2015’ para cifrar cookie

//app.use(session()); //Instalar MW session
/*
Warnings tras foreman start
http://stackoverflow.com/questions/24477035/express-4-0-express-session-with-odd-warning-message
https://www.npmjs.com/package/express-session

19:28:37 web.1  | Mon, 20 Jul 2015 17:28:37 GMT express-session deprecated undefined resave option; provide resave option at app.js:43:9
19:28:37 web.1  | Mon, 20 Jul 2015 17:28:37 GMT express-session deprecated undefined saveUninitialized option; provide saveUninitialized option at app.js:43:9
19:28:37 web.1  | Mon, 20 Jul 2015 17:28:37 GMT express-session deprecated req.secret; provide secret option at app.js:43:9
*/
app.use(session({
    secret: 'cookie_secret',
    resave: true,
    saveUninitialized: true
}));

app.use(methodOverride('_method'));  // Para REST PUT en un POST HTTP
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use(function(req, res, next) {

  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

// auto-logout de sesión ejercicio módulo 9
app.use( function(req, res, next) {
  if ( req.session.user ) {
    if ( Date.now() - req.session.user.lastRequestTime > 120000 ) {  // 2 segundos = 120000ms = 2*60*1000
      delete req.session.user; 
      req.session.errors = [ { "message": 'Sesión finalizada por inactividad' } ];
      res.redirect("/login");
      return;
    } else {
        req.session.user.lastRequestTime = Date.now();
      }
  }
  next();
});

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
