const express = require('express');
const router  = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('dashboard/index', { title: 'Dashboard' });
});

module.exports = router;
