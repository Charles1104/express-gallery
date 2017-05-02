/*jshint esversion:6*/
const express = require('express');
const router = express.Router();

// POST
router.route('/')
  .post((req, res) => {
    articles.registerArticle(req)
      .then(data => {
        res.redirect('/articles/');
      });
  });

// PUT
router.route('/:title')
  .put((req, res) => {
    if(req.body.title === undefined){
      articles.editArticle(req)
        .then(data => {
          res.redirect(303, `/articles/${req.params.title}`);
        });
    } else {
      articles.editArticle(req)
        .then(data => {
          res.redirect(303, `/articles/${req.body.title}`);
        });
    }
  });

// DELETE
router.route('/:title')
  .delete((req, res) => {
    articles.deleteArticle(req)
      .then(data => {
        res.redirect(303, '/articles/');
      });
  });

// GET
router.route('/')
  .get( (req, res) => {
    articles.getArticles()
      .then(data => {
        data.forEach((x) => {
          x.urlTitle = encodeURI(x.title);
        });
        let articlesData = {
          listArticles: data,
          message: req.query.message
        };
        res.render('articles/index', articlesData);
      });
  });

router.route('/new')
  .get( (req, res) => {
    res.render('articles/new', req.query);
  });

router.route('/:title')
  .get( (req, res) => {
    articles.getArticle(req.params.title)
      .then(data => {
        res.render('articles/article',data);
      });
});

router.route('/:title/edit')
  .get( (req, res) => {
      articles.getArticle(req.params.title)
        .then(data => {
          res.render('articles/edit', data);
        });
    });

module.exports = router;