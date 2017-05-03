/*jshint esversion: 6 */

const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const galleryRoutes = require('./routes/gallery.js');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {secure:true}
}));

const db = require('./models');
const PORT = process.env.PORT || 3000;

//handlebars
const hbs = handlebars.create({
  extname:'.hbs',
  defaultLayout: 'main'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use('/static', express.static('public'));

//Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

//Override
app.use(methodOverride('_method'));

// Routes
app.use('/gallery', galleryRoutes);

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

app.get("*", (req, res) => {
  res.status(404).render('helper/404');
});

app.listen(PORT, () => {
  db.sequelize.sync();
});
