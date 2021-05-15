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
    if (req.body.website) profileValue.website = req.body.website
    if (req.body.country) profileValue.country = req.body.country
    if (req.body.portfolio) profileValue.portfolio = req.body.portfolio
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

// Route for getting user profile based on USERNAME, Public Access, Type: GET, /api/profile/:username
// router.get('/:username', (req, res)=>{
//     Profile.findOne({username: req.params.username})
//         .populate('user', ['name', 'profilePic', 'gender'])
//         .then(
//             profile => {
//                 if(!profile){
//                     res.status(404).json({userNameNotFound: "Username not found"})
//                 }
//                 res.json(profile);
//             }
//         )
//         .catch(err => console.log("Error in fetching Username ", err))
// })

//Route for getting user profile based on ID, Public Access, Type: GET, /api/profile/:id
router.get('/:_id', (req, res)=>{
    Profile.findOne({id: req.params.id})
        .populate('user', ['name', 'gender', 'profilePic'])
        .then(
            profile => {
                if(!profile){
                    res.status(404).json({idNotFound: "Id not found"})
                }
                res.json(profile)
            }
        )
        .catch(err => console.log("Error in fetching id ", err))
})

//Route for getting user profile of everyone, Public Access, Type: GET, /api/profile/find/everyone
router.get('/find/everyone',(req, res)=>{
    Profile.find()
        .populate('user', ['name', 'profilePic', 'gender'])
        .then(
            profile => {
                if(!profile){
                    res.status(404).json({noProfile: "No Profile Found"})
                }
                res.json(profile)
                console.log("No. of profile found are: ", profile.length)
            }
        )
        .catch(err => console.log("Problem in getting profiles ", err))
})

module.exports = router;
