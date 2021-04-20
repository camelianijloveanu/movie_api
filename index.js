const express = require('express');
const morgan = require('morgan');
const app = express();

let movies = [
  {
    title: 'How to Marry a Millionaire',
    description: 'How to Marry a Millionaire is a 1953 American romantic comedy film.',
    genre : 'Romantic comedy',
    image: 'https://images-na.ssl-images-amazon.com/images/I/41MKEDHVBTL._SY445_.jpg',
    featured: 'true',
    director: 'Jean Negulesco',
    year: '1953'
  },
  {
    title: 'Niagara',
    description: 'As two couples are visiting Niagara Falls, tensions between one wife and her husband reach the level of murder.',
    genre : 'Mystery, thriller',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTAbDjKTClRFFHqYph3zN8weXOiKmixmOInAwZru6s3hmqOcfh',
    featured: 'true',
    director: 'Henry Hathaway',
    year: '1953'
  },
  {
    title: 'The Seven Year Itch',
    description: 'When his family goes away for the summer, a hitherto faithful husband with an overactive imagination is tempted by a beautiful neighbbor.',
    genre : 'Romantic comedy',
    image: 'https://images-na.ssl-images-amazon.com/images/I/41BVTR4K9GL._SY445_.jpg',
    featured: 'true',
    director: 'Billy Wilder',
    year: '1955'
  },
  {
    title: 'Monkey Business',
    description: 'A chemist finds his personal and professional life turned upside down when one of his chimpanzees finds the fountain of youth.',
    genre : 'Comedy',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLd1Uf7yeqQql-1MBvHQWEkAYjp0l_iKEiZ9ZEDyL2-Ips3v9C',
    featured: 'true',
    director: 'Howard Hawks',
    year: '1952'
  },
  {
    title: 'Some Like it Hot',
    description: 'After two male musicians witness a mob hit, they flee the state in an all-female band disguised as women, but further complications set in.',
    genre : 'Comedy, music, romance',
    image: 'https://images-na.ssl-images-amazon.com/images/I/81Z7zliFaWL._SY679_.jpg',
    featured: 'true',
    director: 'Billy Wilder',
    year: '1959'
  },
  {
    title: 'The Misfits',
    description: 'A divorcée falls for an over-the-hill cowboy who is struggling to maintain his romantically independent lifestyle.',
    genre : 'Drama, romance, western',
    image: 'https://images-na.ssl-images-amazon.com/images/I/514S4V8NDCL.jpg',
    featured: 'true',
    director: 'John Huston',
    year: '1961'
  },
  {
    title: 'The Asphalt Jungle',
    description: 'A major heist goes off as planned, but then double crosses, bad luck and solid police work cause everything to unravel.',
    genre : 'Crime, drama, thriller, film-noir',
    image: 'https://media.elcinema.com/uploads/_315x420_d307b1563d7c7c7a84fc6dd39946a333b5a8ccff3ee11a7d3ee09e915e1ab9fc.jpg',
    featured: 'true',
    director: 'John Huston',
    year: '1950'
  },
  {
    title: 'Gentlemen Prefer Blondes',
    description: 'Showgirls Lorelei Lee and Dorothy Shaw travel to Paris, pursued by a private detective hired by the suspicious father of Lorelei\'s fiancé, as well as a rich, enamored old man and many other doting admirers.',
    genre : 'comedy, musical, romance',
    image: 'https://images-na.ssl-images-amazon.com/images/I/416CT4FW1ZL._SY445_.jpg',
    featured: 'true',
    director: 'Howard Hawks',
    year: '1953'
  },
  {
    title: 'All About Eve',
    description: 'A seemingly timid but secretly ruthless ingénue insinuates herself into the lives of an aging Broadway star and her circle of theater friends.',
    genre : 'Drama',
    image: 'https://i5.walmartimages.com/asr/3ec108bc-29cb-4e7b-9992-cfb0e0044489_1.27a3bc174c90d3a3e6f38a666b46335f.jpeg',
    featured: 'true',
    director: 'Joseph L. Mankiewicz',
    year: '1950'
  },
  {
    title: 'Don\'t Bother to Knock',
    description: 'After being dumped by his girlfriend, an airline pilot pursues a babysitter in his hotel and gradually realizes she\'s dangerous.',
    genre : 'Drama, Film-noi, mystery, thriller',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/Don%27t_bother_to_knock.jpg/220px-Don%27t_bother_to_knock.jpg',
    featured: 'true',
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
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) => {
  return movie.title === req.params.title
  }));
});

app.get('/movies/directors/:name', (req, res) => {
  res.send('Successful GET request returns description of director')
});

app.get('/movies/genres/:genre', (req, res) => {
  res.send('Successful GET request returns description of the genre')
});

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
  res.json(movies);
});

// POST, PUT and DELETE requests
app.post('/users', (req, res) => {
  res.send('Welcome! Your registration was successful!')
});

app.post('/users/:username/favourites', (req, res) => {
  res.send('Movie: ' + req.params.title + ' was added to favourites.');
  });

app.put('/users/:username', (req, res) => {
 res.send('User ' + req.params.username + ' was successfully updated')
});

app.delete('/users/:username/favourites/:title', (req, res) => {
 res.send('Movie: ' + req.params.title + ' was removed from favourites.');
});

app.delete('/users/:username', (req, res) => {
  res.send('User ' + req.params.id + ' was deleted.');
  });


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
