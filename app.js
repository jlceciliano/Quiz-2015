var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var moment = require('moment');


var routes = require('./routes/index');
// var users = require('./routes/users'); // Quitamos la routa a users

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico')); // agregado favicon
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next) {

// guardar path en session.redir para despues de login
    if (!req.path.match(/\/login|\/logout/)) {
        console.log ("------------ app.js ----" + req.path)
        req.session.redir = req.path;
        
    }
    // Hacer visible req.session en las vistas

    res.locals.session = req.session;
    //res.locals.date = Date.now();
    next();
    });

// Pasados 2 minutos de ver la ultima pagina caduca la sesion

    //if (req.session.user){
    //    var diff = Date.now() - req.session.hora;
    //    console.log ("------------ DIFF de HORA ---- " + diff);
    //    res.locals.session.hora = Date.now();
    //    console.log ("------------ puesto a 0 ---- " );
//
    //}

app.use(function(req, res, next) {
    if (req.session.user){
        if ((req.session.hora + 120)<moment().unix() ){
            console.log ("------------ Destruyo sesion ---- " );
            delete req.session.user;
            res.render('sessions/new', {errors: [{"message": "sesión caducada, login otra vez"}]});

        } else {
            console.log ("------------ actualizo la hora  ---- " );
            req.session.hora = moment().unix();

        }

        
        
    }
    next();
});




app.use('/', routes);
// app.use('/users', users); // Quitamos la routa a users

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
            errors:[]
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
        errors:[]
    });
});


module.exports = app;
