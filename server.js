/*jshint esversion: 6 */

const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const galleryRoutes = require('./routes/gallery.js');
const loginRoutes = require('./routes/login.js');
const userRoutes = require('./routes/user.js');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

//passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//session
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

//password hashing
const saltRounds = 10;
const bcrypt = require('bcrypt');

// sequelize
const db = require('./models');
const { User } = require('./models');

//Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

// setup sessions
app.use(cookieParser());
app.use(session({
  store: new RedisStore(),
  secret: 'keyboard_cat',
  resave: false,
  saveUninitialized: true
}));

// setup passport
app.use(passport.initialize());
app.use(passport.session());

// passport local Strategy
passport.use(new LocalStrategy (
  function(username, password, done) {
    console.log('runs before serializing');
    User.findOne({
      where: {
        username: username
      }
    })
    .then ( user => {
      if (user === null) {
        console.log('user failed');
        return done(null, false, {message: 'bad username'});
      }
      else {
        bcrypt.compare(password, user.password)
        .then(res => {
          if (res) { return done(null, user); }
          else {
            return done(null, false, {message: 'bad password'});
          }
        });
      }
    })
    .catch(err => {
      console.log('error: ', err);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log('serializing');
// ^ ---------- given from authentication strategy
  // building the object to serialize to save
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser(function(user, done) {
  console.log('deserializing');
  // ^ ---------- given from serializeUser
  User.findOne({
    where: {
      id: user.id
    }
  }).then(user => {
    return done(null, user); // <------- inserts into the request object
  });
});

//Override
app.use(methodOverride('_method'));

//handlebars
const hbs = handlebars.create({
  extname:'.hbs',
  defaultLayout: 'main'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use('/static', express.static('public'));

// Routes
app.use('/gallery', galleryRoutes);
app.use('/login', loginRoutes);
app.use('/user', userRoutes);

// Simple "/" renders gallery/index
app.get('/', (req, res) => {
  db.Gallery.findAll()
  .then(data => {
    let articlesData = {
      listArticles: data,
    };
    res.render('gallery/index', articlesData);
  })
  .catch(error => {
    console.log(error);
  });
});

// Logout session path
app.get('/logout', function(req, res){
  req.logout();
  res.redirect(303,'/gallery/');
});

// renders a 404 page for any incorrect URL
app.get("*", (req, res) => {
  res.status(404).render('helper/404');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  db.sequelize.sync();
});