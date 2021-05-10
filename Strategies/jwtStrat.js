const JwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const Person = mongoose.model("myPerson");
const mykey = require('../setup/myUrl');

var opts = {}
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = mykey.secret;


module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        Person.findById(jwt_payload.id)
            .then(person=>{
                if(person){
                    return done(null, person);
                }
                return done(null, false)
            })
            .catch(err => console.log(err))
    }))
}

