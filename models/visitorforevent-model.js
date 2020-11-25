const mongoose = require('mongoose');
const VisitorSchema = require('./visitor-model');
const EventSchema = require('./event-model');

const VisitorForEventSchema = new mongoose.Schema({
    visitor: {
        type: VisitorSchema,
        required: true
    },
    event: {
        type: EventSchema,
        required: true
    }
})

const VisitorForEvent = mongoose.model('VisitorForEvent', VisitorForEventSchema);

exports.VisitorForEventSchema = VisitorForEventSchema;
exports.VisitorForEvent = VisitorForEvent;