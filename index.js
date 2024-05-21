require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const validUrl = require('valid-url'); 
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;
let urlDatabase = {}; 
let nextShortUrl = 1;

app.use(cors());
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;
  console.log(originalUrl);
  
  if (!validUrl.isWebUri(originalUrl)) {
    res.json({ error: 'invalid url' });
    return;
  }
  const shortUrl = nextShortUrl++;
  urlDatabase[shortUrl] = originalUrl;
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'short url not found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
