const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const request = require('request');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter');


// ideallyy this would be a model to hold user data
const userData = [];

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SECRET,
}));


passport.use(new TwitterStrategy({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callbackUrl: 'http://localhost:9000/auth/twitter/callback',
  passReqToCallback: true,
}, (req, token, tokenSecret, profile, done) => {
  const user = {
    screen_name: profile._json.screen_name, // eslint-disable-line
    token,
    tokenSecret,
  };
  userData.push(user);
  done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.screen_name);
});

passport.deserializeUser((screen_name, done) => {
  const user = userData.filter((_user) => {
    return _user.screen_name === screen_name;
  });
  if (user[0]) return done(null, user[0]);
  return done(new Error('not found'));
});

app.use(passport.initialize());

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter'), (req, res) => {
  res.redirect('/');
});

app.use(passport.session());

app.use(express.static(path.resolve(__dirname, '../public')));


app.post('/status/tweet', (req, res) => {
  if (!req.user) return res.status(400).json({ error: 'Not Logged in' });

  const body = req.body;
  const oauth = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    token: req.user.token,
    token_secret: req.user.tokenSecret,
  };

  const qs = {
    status: body.status,
  };

  const url = 'https://api.twitter.com/1.1/statuses/update.json';

  return request.post({ url, oauth, qs, json: true }, (err, response, _body) => { // eslint-disable-line
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    if (response.statusCode === 401) {
      return res.status(401).json({ error: 'Failed Authentication' });
    }
    return res.status(200).json({ message: 'Success post' });
  });
});

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: '../public/',
  });
});

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Listening on ${port}`); // eslint-disable-line
});

