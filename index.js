
const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const dotenv = require ('dotenv');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Stories = Models.Story;
const passport = require('passport');
require('./passport');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
dotenv.config();

// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });



const bodyParser = require('body-parser');

let requestTime = (req, res, next) => {
  req.requestTime = Date.now();
  next();
};

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));
app.use(cors());
let auth = require('./auth')(app);

// Error Handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Oops, something went wrong.');
});

// GET requests
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title }).then((movie) => {
    res.status(200).json(movie);
  }).catch((err) => {
    console.error(err);
    res.status(500).json('Error: ' + err)
  });
});

app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({'Director.Name': req.params.Name}).then((director) => {
    res.status(200).json(director.Director);
  }).catch((err) => {
    console.error(err);
    res.status(500).json('Error: ' + err)
  });
});

app.get('/movies/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({'Genre.Name': req.params.Genre}).then((genre) => {
    res.status(200).json(genre.Genre);
  }).catch((err) => {
    console.error(err);
    res.status(500).json('Error: ' + err)
  });
});

app.get('/', (req, res) => {
  let responseText = 'Welcome to my movie club!!';
  res.json(responseText);
});

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find().then((movies) => {
    res.status(200).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).json('Error: ' + err)
  });
});

app.get("/stories", passport.authenticate('jwt', { session: false }), (req, res) => {
Stories.find()
.then((stories) => {
res.status(200).json(stories);
})
.catch((err) => {
console.log(err);
res.status(500).json("Error: " + err);
});
});

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json('Error: ' + err);
    });
});

// POST, PUT and DELETE requests
app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(409).json(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).json('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json('Error: ' + error);
    });
});

app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // confirms the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).json('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // confirms the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).json('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(404).json(req.params.Username + ' was not found');
      } else {
        res.status(200).json(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json('Error: ' + err);
    });
});


// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port' + port);
})
