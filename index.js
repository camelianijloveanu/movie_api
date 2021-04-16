const express = require('express');
const morgan = require('morgan');
const app = express();

let topMovies = [
  {
    title: 'How to Marry a Millionaire',
    director: 'Jean Negulesco',
    year: '1953'
  },
  {
    title: 'Niagra',
    director: 'Henry Hathaway',
    year: '1953'
  },
  {
    title: 'The Seven Year Itch',
    director: 'Billy Wilder',
    year: '1955'
  },
  {
    title: 'Monkey Business',
    director: 'Howard Hawks',
    year: '1952'
  },
  {
    title: 'Some Like it Hot',
    director: 'Billy Wilder',
    year: '1959'
  },
  {
    title: 'The Misfits',
    director: 'John Huston',
    year: '1961'
  },
  {
    title: 'The Asphalt Jungle',
    director: 'John Huston',
    year: '1950'
  },
  {
    title: 'Gentlemen Prefer Blondes',
    director: 'Howard Hawks',
    year: '1953'
  },
  {
    title: 'All About Eve',
    director: 'Joseph L. Mankiewicz',
    year: '1950'
  },
  {
    title: 'Don\'t Bother to Knock',
    director: 'Roy Ward Baker',
    year: '1952'
  },
];

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};


app.use(morgan('common'));
app.use(express.static('public'));
app.use(requestTime);

// Error Handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Oops, something went wrong.');
});

// GET requests
app.get('/', (req, res) => {
  let responseText = 'Welcome to my movie club!!';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.get('/documentation', (req, res) => {
  let responseText = 'Documentation for my api';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  let responseText = 'Top Movies of Marilyn Monroe';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.json(topMovies);
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
