const { Visitor } = require('../models/visitor-model');
const { VisitorForEvent } = require('../models/visitorforevent-model');
const { Event } = require('../models/event-model')
const bcrypt = require('bcryptjs');

class VisitorRepository {
    async registerVisitor(body) {
        const visitor = new Visitor({
            firstName: body.firstName,
            lastName: body.lastName,
            birthYear: body.birthYear,
            gender: body.gender,
            phoneNumber: body.phoneNumber,
            password: await bcrypt.hash(body.password, 10)
        });

        await visitor.save();

        return visitor;
    }

    async setVisitorForEvent(visitorId, eventId) {
        const visitorForEvent = new VisitorForEvent({
            visitor: await Visitor.findOne({ _id: visitorId }),
            event: await Event.findById(eventId)
        });

        await visitorForEvent.save();

        return visitorForEvent;
    }

    async getVisitorById(visitorId) {
        const visitor = await Visitor.findById(visitorId);

        return visitor;
    }

    async getAllVisitors() {
        const visitors = await Visitor.find({});

        return visitors;
    }

    async deleteVisitor(visitorId) {
        const visitor = await Visitor.findByIdAndDelete(visitorId);

        return visitor;
    }

    async editVisitor(visitorId, body) {
        const visitor = await Visitor.findById(visitorId)

        await visitor.update({
            firstName: body.firstName,
            lastName: body.lastName,
            gender: body.gender,
            birthYear: body.birthYear
        })

        return visitor;
    }
}

exports.VisitorRepository = VisitorRepository;