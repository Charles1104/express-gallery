/*jshint esversion:6*/
const express = require('express');
const router = express.Router();
const db = require('../models');

// GET
router.route('/')
  .get( (req, res) => {
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

router.route('/new')
  .get( (req, res) => {
    res.render('gallery/new');
  });

router.route('/:id')
  .get( (req, res) => {
    db.Gallery.findOne({where: {id: req.params.id}})
      .then(data => {
        res.render('gallery/article', data);
      })
      .catch(error => {
        console.log(error);
      });
});

router.route('/:id/edit')
  .get( (req, res) => {
      db.Gallery.findOne({where: {"id": req.params.id}})
        .then(data => {
          res.render('gallery/edit', data);
        })
        .catch(error => {
          console.log(error);
      });
    });

// POST
router.route('/')
  .post((req, res) => {
    db.Gallery.create({"author": req.body.author, "link": req.body.link, "description": req.body.description})
      .then(data => {
        res.redirect('/gallery/');
      })
      .catch(error => {
        console.log(error);
      });
  });

// PUT
router.route('/:id')
  .put((req, res) => {
    db.Gallery.update({"author": req.body.author, "link": req.body.link, "description": req.body.description},{where: {"id": req.params.id}})
      .then(data => {
        res.redirect(303, `/gallery/${req.params.id}`);
      })
      .catch(error => {
        console.log(error);
      });
  });

// DELETE
router.route('/:id')
  .delete((req, res) => {
     db.Gallery.destroy({where: {"id": req.params.id}})
      .then(data => {
        res.redirect(303, '/gallery/');
      })
      .catch(error => {
        console.log(error);
      });
  });

module.exports = router;