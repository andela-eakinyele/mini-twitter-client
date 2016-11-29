const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: process.env.SECRET
}));

app.use(express.static(path.join(__dirname, '/public')));


app.post('/status/tweet', (req, res) => {
	const body = req.body;
	const oauth = {
		consumer_key: process.env.CONSUMER_KEY,
		comsumer_secret: process.env.CONSUMER_SECRET,
		token: process.env.TOKEN,
		token_secret: process.env.TOKEN_SECRET
	}

	const url = 'https://api.twitter.com/1.1/statuses/update.json';

});

app.get('/', (req, res) => {
	res.send('I am okay');
});

const port = process.env.PORT || 9000;

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});

