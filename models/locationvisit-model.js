const mongoose = require('mongoose');
const { EventLocationSchema } = require('./eventlocation-model');
const { VisitorSchema } = require('./visitor-model');

const LocationVisitSchema = new mongoose.Schema({
    visitor: {
        type: VisitorSchema,
        required: true
    },
    location: {
        type: EventLocationSchema,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    finishTime: {
        type: Date,
        required: false
    }
})

const LocationVisit = mongoose.model('LocationVisit', LocationVisitSchema);

exports.LocationVisitSchema = LocationVisitSchema;
exports.LocationVisit = LocationVisit;