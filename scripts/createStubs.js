const fs = require('fs');
const path = require('path');

const base = process.cwd();
const write = (rel, content) => fs.writeFileSync(path.join(base, rel), content);

write('config/database.js', `const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
`);

write('middleware/auth.js', `module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session?.user) return next();
    req.flash('error', 'Please log in to continue');
    res.redirect('/auth/login');
  }
};
`);

write('routes/auth.js', `const express = require('express');
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
`);

write('routes/dashboard.js', `const express = require('express');
const router  = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('dashboard/index', { title: 'Dashboard' });
});

module.exports = router;
`);

write('routes/logs.js', `const express = require('express');
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
`);

console.log('Stub files created.');
