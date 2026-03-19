const express = require('express');
const bcrypt  = require('bcryptjs');
const router  = express.Router();

// NOTE: This is a simple demo user for local development.
// Replace with proper user storage / authentication logic.
const DEMO_USER = {
  id: 1,
  username: 'Admin',
  email: 'admin@ecommerce.com',
  passwordHash: bcrypt.hashSync('admin123', 10),
};

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('auth/login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    req.flash('error', 'Email and password are required');
    return res.redirect('/auth/login');
  }

  if (email !== DEMO_USER.email) {
    req.flash('error', 'Invalid credentials');
    return res.redirect('/auth/login');
  }

  const valid = await bcrypt.compare(password, DEMO_USER.passwordHash);
  if (!valid) {
    req.flash('error', 'Invalid credentials');
    return res.redirect('/auth/login');
  }

  req.session.user = {
    id: DEMO_USER.id,
    username: DEMO_USER.username,
    email: DEMO_USER.email,
  };

  res.redirect('/dashboard');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
