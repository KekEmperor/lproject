const { EventLocation } = require('../models/eventlocation-model');
const { Event } = require('../models/event-model');
const mongoose = require('mongoose');

class EventLocationRepository {
    async createEventLocation(eventId, body) {
        const eventLocation = new EventLocation({
            baseEvent: await Event.findById(eventId),
            name: body.name,
            type: body.type
        });

        eventLocation.save();

        return eventLocation;
    }

    async getLocationsOfEvent(eventId) {
        const locations = await EventLocation.find({
            "baseEvent._id": mongoose.Types.ObjectId(eventId)
        })

        return locations;
    }

    async getLocationById(id) {
        const location = await EventLocation.findById(id);
        return location;
    }
}

exports.EventLocationRepository = EventLocationRepository;