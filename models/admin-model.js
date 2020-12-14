const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/default.json');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

AdminSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, config.appPrivateKey);
    return token;
}

const Admin = mongoose.model('Admin', AdminSchema);

exports.AdminSchema = AdminSchema;
exports.Admin = Admin;