const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load person model
const Person = require("../../models/Person");

//Load profile model
const Profile = require('../../models/Profile')

//Route personal user profile, Private Access, Type: GET, /api/profile
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({
        user: req.user.id,
    })
        .then( profile => {
            if (!profile){
                return res.status(404).json({profileNotFound: "No Profile Found"})
            }
            res.json(profile);
        })
        .catch(err => console.log(err))
})

//Route for updating and saving personal user profile, Private Access, Type: POST, /api/profile
router.post( '/', passport.authenticate('jwt', {session: false}), (req, res)=>{
    const profileValue = {}
    profileValue.user = req.user.id;
    if (req.body.username) profileValue.username = req.body.username
    if (req.body.website) profileValue.username = req.body.website
    if (req.body.country) profileValue.username = req.body.country
    if (req.body.portfolio) profileValue.username = req.body.portfolio
    if (typeof (req.body.languages) != undefined){
        profileValue.languages = req.body.languages.split(',');
    }
    //Get Social Links
    profileValue.social = {}
    if (req.body.youtube) profileValue.social.youtube = req.body.youtube
    if (req.body.facebook) profileValue.social.facebook = req.body.facebook
    if (req.body.instagram) profileValue.social.instagram = req.body.instagram

    //Database Stuff
    Profile.findOne({user: req.user.id})
        .then(profile => {
            if (profile){
                Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileValue},
                    {new: true}
                )
                .then(profile => res.json(profile))
                .catch(err => console.log("Problem in update", err))
            }
            else{
                Profile.findOne({username: profileValue.username})
                .then(profile => {
                    //Username Already exists
                    if(profile){
                        res.status(400).json({username:"Username already exist"})
                    }
                    //Save profile
                    new Profile(profileValue).save()
                    .then(profile => res.json(profile))
                    .catch(err => console.log("Problem in saving profile", err))
                })
                .catch(err => console.log(err))
            }
        })
        .catch(err => console.log("Problem in fetching profile ", err))
})

module.exports = router;
