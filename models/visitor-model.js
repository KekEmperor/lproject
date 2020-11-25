const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthYear: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    }
})

VisitorSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, config.appPrivateKey);
    return token;
}

const Visitor = mongoose.model('Visitor', VisitorSchema);

exports.VisitorSchema = VisitorSchema;
exports.Visitor = Visitor;