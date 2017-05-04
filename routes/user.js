/*jshint esversion:6*/
const express = require('express');
const router = express.Router();
const db = require('../models');
const flash = require('connect-flash');

//password hashing
const saltRounds = 10;
const bcrypt = require('bcrypt');

router.use(flash());

// GET
router.route('/new')
  .get( (req, res) => {
    res.render('user/new');
  });

// POST -- new user section
router.route('/')
  .post((req, res) => {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      db.User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: hash
      })
      .then( (user) => {
        console.log(user);
        res.redirect('/login');
      });
    });
  });
});

// DELETE
router.route('/:id')
  .delete((req, res) => {
     db.User.destroy({where: {"id": req.params.id}})
      .then(data => {
        res.redirect(303, '/user/new');
      })
      .catch(error => {
        res.redirect('/user/new');
      });
  });

module.exports = router;