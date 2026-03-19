const express = require('express');
const router  = express.Router();
const db      = require('../config/database');

// GET /alerts
router.get('/', async (req, res) => {
  try {
    const [alerts] = await db.execute(
      `SELECT * FROM alerts WHERE is_dismissed=0 ORDER BY created_at DESC`
    );
    res.render('alerts/index', {
      title: 'Alerts',
      alerts
    });
  } catch (err) {
    console.error(err);
    res.render('error', {
      title: 'Error',
      message: err.message,
      user: req.session.user || null
    });
  }
});

// POST /alerts/:id/read
router.post('/:id/read', async (req, res) => {
  await db.execute(`UPDATE alerts SET is_read=1 WHERE alert_id=?`, [req.params.id]);
  res.json({ ok: true });
});

// POST /alerts/:id/dismiss
router.post('/:id/dismiss', async (req, res) => {
  await db.execute(`UPDATE alerts SET is_dismissed=1 WHERE alert_id=?`, [req.params.id]);
  res.json({ ok: true });
});

// POST /alerts/read-all
router.post('/read-all', async (req, res) => {
  await db.execute(`UPDATE alerts SET is_read=1 WHERE is_dismissed=0`);
  res.redirect('/alerts');
});

module.exports = router;