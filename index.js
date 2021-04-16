const express = require('express');
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

app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
