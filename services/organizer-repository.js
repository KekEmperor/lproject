const { Organizer } = require('../models/organizer-model');
const bcrypt = require('bcryptjs')

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
}

exports.OrganizerRepository = OrganizerRepository;