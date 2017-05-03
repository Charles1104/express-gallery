 /*jshint esversion:6*/
const express = require('express');
const router = express.Router();
const db = require('../models');
const flash = require('connect-flash');

router.use(flash());

// GET
router.route('/')
  .get((req, res) => {
    db.Gallery.findAll({order:'id'})
      .then(data => {
        let listPhotos = {instances: data};
        res.render('gallery/index', listPhotos);
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

    let renderVars = {};
    db.Gallery.findOne({where: {id: req.params.id}})
      .then(data => {
        renderVars.featured = data.dataValues;
      })
      .then(data => {
        return db.Gallery.findAll({where:{$not:[{id: [req.params.id]}]}})
          .then(data => {
            renderVars.allPhotos = data;
          });
      })
      .then(data => {
        console.log(renderVars);
        res.render('gallery/article', renderVars);
      })
      .catch(error => {
        res.redirect('/gallery/');
      });
});

router.route('/:id/edit')
  .get( (req, res) => {
      db.Gallery.findOne({where: {"id": req.params.id}})
        .then(data => {
          res.render('gallery/edit', data.dataValues);
        })
        .catch(error => {
          res.redirect('/gallery/');
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
        res.redirect('/gallery/');
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
        res.redirect('/gallery/');
      });
  });

module.exports = router;