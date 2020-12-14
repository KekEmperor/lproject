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
        console.log(eventId, visitorId);

        const vsis = await Visitor.findOne({ _id: visitorId });
        console.log(vsis)

        const visitorForEvent = new VisitorForEvent({
            visitor: vsis,
            event: await Event.findById(eventId)
        });

        await visitorForEvent.save();

        return visitorForEvent;
    }
}

exports.VisitorRepository = VisitorRepository;