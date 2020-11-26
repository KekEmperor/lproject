const { Admin } = require('../models/admin-model');
const bcrypt = require('bcryptjs')

class AdminRepository {
    async registerAdmin(body) {
        const admin = new Admin({
            email: body.email,
            password: await bcrypt.hash(body.password, 10)
        }); 

        admin.save();

        return admin;
    }
}

exports.AdminRepository = AdminRepository;