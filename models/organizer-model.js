const jwt = require('jsonwebtoken');
const config = require('../config/default.json');
const mongoose = require('mongoose');

const OrganizerSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60
    },
    email: {
        type: String,
        required: true,
        minlength: 6
    },
    password: {
        type: String,
        required: false
    }
})

OrganizerSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, config.appPrivateKey);
    return token;
}

const Organizer = mongoose.model('Organizer', OrganizerSchema);

exports.OrganizerSchema = OrganizerSchema;
exports.Organizer = Organizer;