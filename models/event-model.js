const mongoose = require('mongoose');
const { OrganizerSchema } = require('../models/organizer-model');

const EventSchema = new mongoose.Schema({
    organizer: {
        type: OrganizerSchema,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 5
    },
    startDate: {
        type: Date,
        required: true
    },
    finishDate: {
        type: Date,
        required: true
    },
    locationCountry: {
        type: String,
        required: false
    },
    locationCity: {
        type: String,
        required: false
    },
    locationAddress: {
        type: String,
        required: false
    },
    locationPlace: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    }
})

const Event = mongoose.model('Event', EventSchema);

exports.EventSchema = EventSchema;
exports.Event = Event;