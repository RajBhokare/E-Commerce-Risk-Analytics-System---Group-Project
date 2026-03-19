const express = require('express');
const router  = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, (_req, res) => {
  res.redirect('/logs/login-attempts');
});

router.get('/login-attempts', ensureAuthenticated, (req, res) => {
  res.render('logs/login-attempts', { title: 'Login Attempts' });
});

router.get('/transactions', ensureAuthenticated, (req, res) => {
  res.render('logs/transactions', { title: 'Transactions' });
});

module.exports = router;
