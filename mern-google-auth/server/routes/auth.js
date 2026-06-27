const express = require('express');
const passport = require('passport');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'] ,
    prompt: 'consent'
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/profile`);
  }
);

router.get('/me', ensureAuthenticated, (req, res) => {
  res.json({
    displayName: req.user.displayName,
    email: req.user.email,
    profilePhoto: req.user.profilePhoto,
  });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return next(sessionErr);
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

module.exports = router;
