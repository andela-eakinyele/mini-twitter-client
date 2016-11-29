const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const request = require('request');
// const passport = require('passport');
// const TwitterStrategy = require('passport-twitter');

require('dotenv').config();

const app = express();

// passport.use(new TwitterStrategy({
//   consumerKey: process.env.CONSUMER_KEY,
//   consumerSecret: process.env.CONSUMER_SECRET,
//   callbackUrl: 'http://localhost:9000/auth/twitter/callback',
//   passReqToCallback: true,
// }, (req, token, tokenSecret, profile, done) => {
//   done(null);
// }));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SECRET,
}));

// app.use(passport.initialize());

app.use(express.static(path.resolve(__dirname, '../public')));

// app.get('/auth/twitter', passport.authenticate('twitter'));

// app.get('/auth/twitter/callback', (req, res) => {
//   res.redirect('/');
// });

app.post('/status/tweet', (req, res) => {
  const body = req.body;

  const oauth = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    token: process.env.TOKEN,
    token_secret: process.env.TOKEN_SECRET,
  };

  const qs = {
    status: body.status,
  };

  const url = 'https://api.twitter.com/1.1/statuses/update.json';

  request.post({ url, oauth, qs, json: true }, (err, response, _body) => { // eslint-disable-line
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

