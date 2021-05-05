const express = require('express');

const app = express();

//route

app.get('/', (req, res) => {
  res.send("Welcome to big stack project ")
});

const port = process.env.port || 3000;

app.listen(port, ()=> console.log(`App is running at ${port}`)); 