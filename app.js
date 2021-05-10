const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const bodyparser = require('body-parser');
const passport = require('passport')

const app = express();

//middleware for express
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//bring all routes
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const question = require('./routes/api/question');

//MongoDB configuration
db = require('./setup/myUrl').mongoURL


//Attempt to connect to db
mongoose.connect(db, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
}).then(()=>{
  console.log("MongoDB connected successfully");
}).catch(err => {
  console.log(err)
})

//Passport middleware
app.use(passport.initialize());

//Config for JWT strategy
require('./Strategies/jwtStrat')(passport);

// Test route
app.get('/', (req, res) => {
  res.send("Welcome to big stack project ")
});

//actual routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/question", question);

const port = process.env.port || 3000;

app.listen(port, ()=> console.log(`App is running at ${port}`)); 
