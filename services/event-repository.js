const { Event } = require('../models/event-model');
const { Organizer } = require('../models/organizer-model');
const { VisitorForEvent } = require('../models/visitorforevent-model');
const { LocationVisit } = require('../models/locationvisit-model');
const { EventLocation } = require('../models/eventlocation-model');
const { Visitor } = require('../models/visitor-model');
const mongoose = require('mongoose');
const { EventLocationRepository } = require('./eventlocation-repository');

const eventLocationRepository = new EventLocationRepository();

class EventRepository {
    async createEvent(organizerId, body) {
        const event = new Event({
            organizer: await Organizer.findById(organizerId),
            name: body.name,
            startDate: body.startDate,
            finishDate: body.finishDate,
            locationCountry: body.locationCountry,
            locationCity: body.locationCity,
            locationAddress: body.locationAddress,
            locationPlace: body.locationPlace,
            description: body.description
        });

        event.save();

        return event;
    }

    async editEvent(eventId, body) {
        const event = await Event.findById(eventId);

        await event.update({
            name: body.name,
            startDate: body.startDate,
            finishDate: body.finishDate,
            locationCountry: body.locationCountry,
            locationCity: body.locationCity,
            locationAddress: body.locationAddress,
            locationPlace: body.locationPlace,
            description: body.description
        });

        event.save();

        await eventLocationRepository.editLocationsForEvent(eventId, body);

        return event;
    }

    async deleteEvent(eventId) {
        await Event.findByIdAndDelete(eventId);
    }

    async deleteEventsForOrganizer(orgId) {
        await Event.deleteMany({ 'organizer._id': mongoose.Types.ObjectId(orgId)});
    }

    async editEventsForOrganizer(orgId, body) {
        await Event.updateMany({ "organizer._id": mongoose.Types.ObjectId(orgId) }, {
            'organizer.companyName': body.companyName
        })
    }

    async getAllEvents() {
        const events = await Event.find({});
        return events;
    }

    async getEventById(eventId) {
        const event = await Event.findById(eventId);

        return event;
    }

    async getEventsByOrganizer(organizerId) {
        const events = await Event.find({
            "organizer._id": mongoose.Types.ObjectId(organizerId)
        });

        return events;
    }

    async getVisitorOnEvent(visitorId, eventId) {
        const visitor = await VisitorForEvent.findOne({
            "visitor._id": mongoose.Types.ObjectId(visitorId),
            "event._id": mongoose.Types.ObjectId(eventId)
        });

        return visitor;
    }

    async getVisitorsOnEvent(eventId) {
        const visitors = await VisitorForEvent.find({
            "event._id": mongoose.Types.ObjectId(eventId)
        });

        return visitors;
    }

    async setVisitOnLocation(id, body) {
        console.log(body.visitorId);
        console.log(await Visitor.findById(body.visitorId));
        const locationVisit = new LocationVisit({
            visitor: await Visitor.findById(body.visitorId),
            location: await EventLocation.findById(id),
            startTime: body.startTime,
            finishTime: body.finishTime
        });

        locationVisit.save();

        return locationVisit;
    }

    async getVisitsOfEvent(eventId) {
        const visits = await LocationVisit.find({
            "location.baseEvent._id": mongoose.Types.ObjectId(eventId)
        });

        return visits;
    }

    async getVisitsOfEventByVisitor(eventId, visitorId) {
        const visits = await LocationVisit.find({
            "location.baseEvent._id": mongoose.Types.ObjectId(eventId),
            "visitor._id": mongoose.Types.ObjectId(visitorId),
            "location.type": 'Stage'
        });

        return visits;
    }

    async normalizeVisitsByVisitor(eventId, visitorId) {
        const visits = await this.getVisitsOfEventByVisitor(eventId, visitorId);

        visits.sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime));

        for (let i = 0; i < visits.length - 1; i++) {
            if (Date.parse(visits[i].finishTime) > Date.parse(visits[i + 1].startTime)) {
                visits[i].finishTime = visits[i + 1].startTime;

                await visits[i].save();
            }
        }

        return visits;
    }

    async normalizeVisits(eventId) {
        const visitors = (await this.getVisitorsOnEvent(eventId)).map(v => v.visitor._id);

        visitors.forEach(async visitorId => {
            const normVisits = await this.normalizeVisitsByVisitor(eventId, visitorId);
        });
    }
}

exports.EventRepository = EventRepository;