const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    profilePic:{
        type: String,

    },
    date: {
        type: Date,
        default: Date.now
    },
    gender: {
        type: String,
        required: true
    }
});

module.exports = Person = mongoose.model("myPerson", PersonSchema);
