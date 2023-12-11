const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cors = require('cors');
const dotenv = require("dotenv");
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);


//transporter object
dotenv.config();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/sherlock', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('strictQuery', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to sherlock DB")
});



//schema for user in mongodb
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  verificationCode: Number,
  isVerified: Boolean
});
const User = mongoose.model('User', userSchema);

//schema for user score in mongodb
const scoreSchema = new mongoose.Schema({
  email: String,
  username: String,
  score: Number
});

const matchPredictionSchema = new mongoose.Schema({
  matchId: Number,
  team1SName: String,
  inputvalue1: Number,
  team2SName: String,
  inputvalue2: Number,
  isCheckFinished: Boolean,
});


const predictionSchema = new mongoose.Schema({
  email: String,
  prediction: [matchPredictionSchema]
});

const newScoreSchema = new mongoose.Schema({
  matchId: Number,
  team1SName: String,
  inputvalue1: Number,
  team2SName: String,
  inputvalue2: Number,
});

const newScoreModel = mongoose.model('newScore', newScoreSchema);
const PredictionModel = mongoose.model('Prediction', predictionSchema);
const Score = mongoose.model('Score', scoreSchema);

//enabling cors
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit numeric code
}

const verificationCode = generateVerificationCode();

app.post('/signup', (req, res) => {
  console.log('Request body: ', req.body);

  const { email } = req.body;
  const { password } = req.body;
  // Input validation

  if (!req.body) {
    return res.status(400).json({ error: 'Request body is missing' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password || password.length < 6 || !/^(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long and contain a mix of upper and lowercase letters' });
  }


  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred' });
    }

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }


    // Hash the password
    //asynchronous function
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        res.status(500).json({ error: err });
        return;
      }
      const user = new User({
        email: email,
        password: hash,
        isVerified: false,
        verificationCode: verificationCode
      });


      user.save()
        .then(savedUser => {
          // Registration successful
          console.log('User registered:', savedUser);

          // Additional logic (e.g., sending confirmation email, redirecting to login page)
          const mg = mailgun.client({ username: 'api', key: 'key-31b68900596568c57faf5caf7537980f' });
          mg.messages.create('sandbox426139a070c846f9ae7356f17012d852.mailgun.org', {
            from: "Excited User <mailgun@sandbox-123.mailgun.org>",
            to: [email],
            subject: "Verify your email",
            text: `Your verification code is: ${verificationCode}`, // Include the verification code in the email content
            html: `<h1>Verify your email</h1><p>Your verification code is: <strong>${verificationCode}</strong></p>` // Include the verification code in the email content
          })
            .then(msg => {
              console.log('Verification email sent:', msg);
              const score = new Score({
                email: email,
                score: 0
              });
              score.save()
                .then(savedScore => {
                  // Registration successful
                  console.log('Score registered:', savedScore);
                  res.status(201).json({ message: 'User registered successfully. A verification code has been sent to your email.' });
                  // Additional logic (e.g., sending confirmation email, redirecting to login page)
                })
                .catch(error => {
                  // Registration failed
                  console.error('Error registering score:', error);
                  // Handle the error (e.g., displaying an error message to the user)
                });
            })
            .catch(err => {
              console.log('Error sending verification email:', err);
              res.status(500).json({ error: 'An error occurred while sending the verification email' });
            });
        })
        .catch(error => {
          // Registration failed
          console.error('Error registering user:', error);
          // Handle the error (e.g., displaying an error message to the user)
        });
    });

  });


  // Store the hashed password in your database


});

//Login end point
app.post('/authentication', (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  // Input validation
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is missing' });
  }
  if (!email) {
    return res.status(401).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(402).json({ error: 'Password is required' });
  }
  // Authenticate user
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred' });
    }
    if (!user) {
      return res.status(403).json({ error: 'Invalid email or password' });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      if (result) {
        const token = jwt.sign(
          { email: user.email },
          process.env.JWT_KEY,
          { expiresIn: '1h' }
        );
        Score.findOne({ email: email }, (err, score) => {
          const username = score.username;
          if (err) {
            return res.status(500).json({ error: 'An error occurred' });
          }
          if (!score) {
            return res.status(404).json({ error: 'Score not found' });
          }
          console.log('User authenticated:', username);
          return res.status(200).json({ message: 'Authentication successful', token: token, username: username });
        });
      };
    });
  });
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Token is valid, extract the decoded information
    req.user = decoded;
    next();
  });
};

app.post('/scorepredicted', verifyToken, async (req, res) => {
  const { email } = req.user;
  var { matchId, inputValue1, inputValue2, true1, isCheckFinished, team1SName, team2SName } = req.body;
  inputValue1 = parseInt(inputValue1, 10);
  inputValue2 = parseInt(inputValue2, 10);

  if (!true1) {
    console.log("Match already started");
    return res.status(400).json({ error: 'Match already started' });
  }

  try {
    // Check if a prediction already exists for the given matchId and email
    const existingPrediction = await PredictionModel.findOne({
      email: email,

    });

    if (existingPrediction) {
      // If a prediction exists, update its values
      // Check if a prediction with the same matchId already exists in the prediction array
      const existingMatchPrediction = existingPrediction.prediction.find(
        (pred) => pred.matchId === matchId
      );

      if (existingMatchPrediction) {
        // If a prediction with the same matchId exists, update its values
        existingMatchPrediction.inputvalue1 = inputValue1;
        existingMatchPrediction.inputvalue2 = inputValue2;
        existingMatchPrediction.team1SName = team1SName;
        existingMatchPrediction.team2SName = team2SName;
        existingMatchPrediction.isCheckFinished = isCheckFinished;
        await existingPrediction.save();
        console.log("Prediction updated successfully");
        return res.status(200).json({ message: 'Prediction updated successfully' });
      } else {
        // If no prediction with the same matchId exists, add a new prediction
        existingPrediction.prediction.push({
          matchId: matchId,
          team1SName: team1SName,
          inputvalue1: inputValue1,
          team2SName: team2SName,
          inputvalue2: inputValue2,
          isCheckFinished: isCheckFinished,
        });
        await existingPrediction.save();
        console.log("New prediction created");
        return res.status(201).json({ message: 'New prediction created' });
      }
    }
    else {
      // If no prediction exists, create a new prediction
      await PredictionModel.create({
        email: email,
        prediction: [
          {
            matchId: matchId,
            team1SName: team1SName,
            inputvalue1: inputValue1,
            team2SName: team2SName,
            inputvalue2: inputValue2,
            isCheckFinished: isCheckFinished,
          },
        ],
      });
      console.log("New prediction created with mail id");
      return res.status(201).json({ message: 'New prediction created' });
    }
  } catch (error) {
    console.error("Error saving prediction:", error);
    return res.status(500).json({ error: 'Error saving prediction' });
  }
});

app.post('/verification', (req, res) => {
  const { code, username } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Verification code is required' });
  }

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  User.findOne({ verificationCode: code })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'Verification code is wrong or user not found' });
      }

      // Update the user's isVerified status to true
      User.findOneAndUpdate({ verificationCode: code }, { isVerified: true }, { new: true })
        .then(updatedUser => {
          if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
          }

          Score.findOne({ username: username })
            .then(existingScore => {
              if (existingScore) {
                return res.status(409).json({ error: 'Username already exists in the score records' });
              }

              // If the username is unique, update the score record
              Score.findOneAndUpdate({ email: updatedUser.email }, { username: username }, { new: true })
                .then(updatedScore => {
                  if (updatedScore) {
                    return res.status(201).json({ username: updatedScore.username });
                  } else {
                    // Create a new score record if it doesn't exist
                    const newScore = new Score({
                      email: updatedUser.email,
                      username: username,
                      score: 0
                    });
                    newScore.save()
                      .then(savedScore => {
                        return res.status(201).json({ username: savedScore.username });
                      })
                      .catch(error => {
                        console.error('Error saving new score:', error);
                        res.status(500).json({ error: 'An error occurred while saving the new score' });
                      });
                  }
                })
                .catch(error => {
                  console.error('Error updating score:', error);
                  res.status(500).json({ error: 'An error occurred while updating the score' });
                });
            })
            .catch(error => {
              console.error('Error finding score:', error);
              res.status(500).json({ error: 'An error occurred while finding the score' });
            });
        })
        .catch(error => {
          console.error('Error updating user:', error);
          res.status(500).json({ error: 'An error occurred while updating the user' });
        });
    })
    .catch(error => {
      console.error('Error finding user:', error);
      res.status(500).json({ error: 'An error occurred while finding the user' });
    });
});

app.post('/userprofile', (req, res) => {
  const { username } = req.body;
  Score.findOne({ username: username }, (err, score) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred' });
    }
    if (!score) {
      return res.status(404).json({ error: 'Score not found' });
    }
    return res.status(200).json({ username: score.username, score: score.score });
  })
});

app.post('/updatetodayscores', (req, res) => {
  const { newscores } = req.body;
  if (newscores === undefined) {
    return res.status(400).json({ error: 'New scores are required' });
  }
  else {
    for (let i = 0; i < newscores.length; i++) {
      newScoreModel.create({
        matchId: newscores[i].matchId,
        team1SName: newscores[i].team1SName,
        inputvalue1: newscores[i].inputvalue1,
        team2SName: newscores[i].team2SName,
        inputvalue2: newscores[i].inputvalue2,
      })
    }
  }
});

app.post('/update', (req, res) => {
  const { email } = req;
  PredictionModel.findOne({ email: email }, (err, prediction) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred' });
    }
    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

  })
});
app.listen(3001, () => {
  console.log('Server listening on port 3001');
  console.log('CORS-enabled server running on port 3001');
});