var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const db = require('./models/index');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());

//Middleware for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 app.use(cookieParser());

//Pour servir des fichiers statiques tels que les images, les fichiers CSS et les fichiers JavaScript,
// exmpl http://localhost:3000/css/style.css
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res) {
  res.send("Invalid page");
});

require('./routes/index')(app);


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

  // sync our sequelize models and then start server
// force: true will wipe our database on each server restart
// this is ideal while we change the models around
/*----------
db.sequelize.sync(
   { force: true }
    ).then(() => {
    // inside our db sync callback, we start the server
    // this is our way of making sure the server is not listening
    // to requests if we have not made a db connection
 app.listen(PORT, () => {
      console.log(`App listening on PORT ${PORT}`);
    });
  });
  -----------------
*/

});

module.exports = app;
