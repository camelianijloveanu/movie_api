
const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Star = Models.Star;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
const bodyParser = require('body-parser');

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));

// Error Handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Oops, something went wrong.');
});

// GET requests
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title }).then((movie) => {
    res.status(201).json(movie);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

app.get('/movies/directors/:Name', (req, res) => {
  Movies.findOne({'Director.Name': req.params.Name}).then((director) => {
    res.status(201).json(director.Director);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

app.get('/movies/genres/:Genre', (req, res) => {
  Movies.findOne({'Genre.Name': req.params.Genre}).then((genre) => {
    res.status(201).json(genre.Genre);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
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
    Movies.find().then((movies) => {
    res.status(201).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

app.get('/star', (req, res) => {
    Star.find().then((star) => {
    res.status(201).json(star);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err)
  });
});

app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// POST, PUT and DELETE requests
app.post('/users', (req, res) => {
  Users.findOne({Username: req.body.Username}).then((user) => {
    if(user) {
      return res.status(400).send(req.body.Username + ' already exists.');
    } else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }).then((user) => {res.status(201).json(user)}).catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
  });

app.post('/users/:Username/Movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // confirms the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // confirms the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
})
