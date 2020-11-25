const mongoose = require('mongoose');
const { EventSchema } = require('./event-model');

const EventLocationSchema = new mongoose.Schema({
    baseEvent: {
        type: EventSchema,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

const EventLocation = mongoose.model('EventLocation', EventLocationSchema);

exports.EventLocationSchema = EventLocationSchema;
exports.EventLocation = EventLocation;