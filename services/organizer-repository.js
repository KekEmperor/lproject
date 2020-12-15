const { Organizer } = require('../models/organizer-model');
const { EventRepository } = require('./event-repository');
const bcrypt = require('bcryptjs')

const eventRepository = new EventRepository();

class OrganizerRepository {
    async registerOrganizer(body) {
        const organizer = new Organizer({
            companyName: body.companyName,
            email: body.email,
            password: await bcrypt.hash(body.password, 10)
        }); 

        organizer.save();

        return organizer;
    }

    async editOrganizer(orgId, body) {
        const organizer = await Organizer.findById(orgId);

        await organizer.update({
            companyName: body.companyName
        });

        await eventRepository.editEventsForOrganizer(orgId, body);

        return organizer;
    }

    async getAllOrganizers() {
        const organizers = await Organizer.find({});

        return organizers;
    }

    async deleteOrganizer(orgId) {
        const organizer = await Organizer.findByIdAndDelete(orgId);

        await eventRepository.deleteEventsForOrganizer(orgId);

        return organizer;
    }

    async getOrganizerById(orgId) {
        const organizer = await Organizer.findById(orgId);

        return organizer;
    }
}

exports.OrganizerRepository = OrganizerRepository;