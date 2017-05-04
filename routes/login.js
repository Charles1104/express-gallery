/*jshint esversion:6*/
const express = require('express');
const router = express.Router();
const db = require('../models');
const flash = require('connect-flash');

//passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.use(flash());

// GET
router.route('/')
  .get((req, res) => {
  res.render('login/index');
});

// POST
router.route('/')
  .post(passport.authenticate('local', {
  successRedirect: '/gallery',
  failureRedirect: '/login'
}));

module.exports = router;