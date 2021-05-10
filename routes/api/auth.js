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
});

//Route to login user, Public Access, Type: Post, /api/auth/login

router.post("/login", (req, res)=>{

    const email = req.body.email;
    const password = req.body.password;

    Person.findOne({email})
        .then( person => {
            if (!person){
                return res.status(404).json({emailError: "User not found"})
            }

            bcrypt.compare(password, person.password)
                .then(isCorrect => {
                    if (isCorrect){
                        // res.json({success: "User logged in"})

                        //Use payload and create token for user
                        const payload ={
                            id: person.id,
                            name: person.name,
                            email: person.email
                        };
                        jwt.sign(
                            payload,
                            key.secret,
                            {expiresIn: 3600},
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: "Bearer" + token
                                });
                            }

                        )
                    }
                    else{
                        res.status(400).json({passwordError: "Incorrect Password"})
                    }
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err));


})

module.exports = router;
