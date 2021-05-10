const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../setup/myUrl');


//Test Route, Public Access, type: get, /api/auth
router.get("/", (req, res)=> res.json({test: "Auth is success"}));

//Import Schema for person to register
const Person = require("../../models/Person");

//Route to register user, Public Access, Type: Post, /api/auth/register
router.post('/register', (req, res)=> {
    Person.findOne({email: req.body.email})
        .then(person =>{
            if (person){
                return res.status(400).json({emailError: "Email is already registered in our system"});
            }
            else{
                const newPerson = new Person({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                //Encrypting password using bcrypt
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newPerson.password, salt, (err, hash) => {
                        if (err) throw err;
                        newPerson.password = hash;
                        newPerson
                            .save()
                            .then(person => res.json(person))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
        .catch(err => console.log(err));
})

module.exports = router;
