var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var sessions = require('express-session');
var body = require('body-parser');

var jsonParser = body.json();
var urlencoded = body.urlencoded({extended:false});

var handlebars = require('hbs');

var app = express();
var ip;
app.use(sessions({
	saveUninitialized:true,
	secret:process.env.SECRET,
	resave:false
}));

 

var loginRouter = require('./routes/login');
var createRouter = require('./routes/createUser');
var connectedRouter = require('./routes/user/connected');
var solveRouter = require('./routes/user/solve');
var adminRouter = require('./routes/admin/connected');
var adminSolveRouter = require('./routes/admin/solve');
var makeAdminRouter = require('./routes/admin/makeAdmin');
adminSecured = async(req, res, next)=>{
  try {
    if(req.session.admin){
      next();
    }else{
      res.redirect('/login');
    }
  }catch (error){
    console.log(error);
    throw error;
  }
}

secured = async(req, res, next)=>{
  try{
    if(req.session.id_user){
      next();
    }else{
      res.redirect('/login');
    }
  }catch (error){
    console.log(error);
    throw error;
  }
}

handlebars.registerHelper('if_defined', function(a, opt){
  if(a != undefined){
    return opt.fn(this);
  }else{
    return opt.inverse(this);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
ipGetter = (req, res, next)=>{
  global.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  next();
}

app.use('/', indexRouter,ipGetter)
app.use('/users', usersRouter,ipGetter);

app.use('/login',loginRouter,ipGetter);
app.use('/createUser', createRouter,ipGetter);
app.use('/user/solve', secured, solveRouter);
app.use('/admin/connected', adminSecured, adminRouter);
app.use('/admin/solve', adminSecured, adminSolveRouter);
app.use('/user/connected', secured, connectedRouter);
app.use('/admin/makeAdmin', adminSecured, makeAdminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
