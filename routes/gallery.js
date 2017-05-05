/*jshint esversion:6*/
const express = require('express');
const router = express.Router();
const db = require('../models');
const isAuthenticated = require('../helper/helper.js');

// GET
router.route('/')
  .get((req, res) => {
    db.Gallery.findAll({order:'id'})
      .then(data => {
        let listPhotos = {instances: data};
        if(req.user !== undefined){
          listPhotos.user= req.user;
        }
        res.render('gallery/index', listPhotos);
      })
      .catch(error => {
        console.log(error);
      });
  });

router.route('/new')
  .get( (req, res) => {
    res.render('gallery/new',{username:req.user.username});
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
        let flash = req.flash('info');
        if(flash !== undefined && flash[0] !== undefined){
          renderVars.flash = flash[0];
        }
        renderVars.user = (req.user.id === renderVars.featured.UserId);
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
  .post(isAuthenticated,(req, res) => {
    db.Gallery.create({"author": req.body.author, "link": req.body.link, "description": req.body.description, "UserId": req.user.id})
      .then(data => {
        console.log(isAuthenticated);
        res.redirect('/gallery/');
      })
      .catch(error => {
        console.log(error);
      });
  });

// PUT
router.route('/:id')
  .put(isAuthenticated, (req, res) => {
    db.Gallery.findOne({where: {"id": req.params.id}})
      .then(data => {
        if(data.dataValues.UserId === req.user.id){
          db.Gallery.update({"author": req.body.author, "link": req.body.link, "description": req.body.description},{where: {"id": req.params.id}})
          .then(data => {
            res.redirect(303, `/gallery/${req.params.id}`);
          })
          .catch(error => {
            res.redirect('/gallery/');
          });
        } else{
          req.flash('info', 'You can only edit pictures of your gallery');
          res.redirect(303,`/gallery/${req.params.id}`);
        }
      });
  });

// DELETE
router.route('/:id')
  .delete(isAuthenticated, (req, res) => {
     db.Gallery.findOne({where: {"id": req.params.id}})
      .then(data => {
        if(data.dataValues.UserId === req.user.id){
          db.Gallery.destroy({where: {"id": req.params.id}})
          .then(data => {
            res.redirect(303, '/gallery/');
          })
          .catch(error => {
            console.log(error);
            res.redirect(303, '/gallery/');
          });
        } else{
          req.flash('info', 'You can only delete pictures of your gallery');
          res.redirect(303,`/gallery/${req.params.id}`);
        }
      });
  });

module.exports = router;