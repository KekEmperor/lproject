const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/admin-auther');
const { AdminRepository } = require('../services/admin-repository');
const { Admin } = require('../models/admin-model');
const { EventRepository } = require('../services/event-repository');
const { OrganizerRepository } = require('../services/organizer-repository');
const { VisitorRepository } = require('../services/visitor-repository')

const organizerRepository = new OrganizerRepository();
const eventRepository = new EventRepository();
const adminRepository = new AdminRepository();
const visitorRepository = new VisitorRepository();

router.post('/admin', async (req, res) => {
    let admin = await adminRepository.registerAdmin(req.body);

    const token = admin.generateAuthToken()

    if (admin) {
        res
            .header('x-auth-token', token)
            .status(201)
            .send(admin);
    }
    else {
        res.sendStatus(400);
    }
});

router.post('/admin/login', async (req, res) => {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
        return res
            .status(404)
            .send('No users were found by this email');
    }

    if (await bcrypt.compare(req.body.password, admin.password)) {
        const token = admin.generateAuthToken();
        res
            .header('x-auth-token', token)
            .status(200)
            .send({
                adminId: admin._id,
                token: token
            });
    }
    else {
        res
            .status(401)
            .send('Wrong password');
    }
})

router.put('/admin/:adminId/event/:eventId/edit', adminAuth, async (req, res) => {
    if (req.params.adminId !== req.admin._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const event = await eventRepository.editEvent(req.params.eventId, req.body);

    if (event) {
        res.status(200).send(event);
    }
    else {
        res.sendStatus(400);
    }
})

router.put('/admin/:adminId/organizer/:orgId/edit', adminAuth, async (req, res) => {
    if (req.params.adminId !== req.admin._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const organizer = await organizerRepository.editOrganizer(req.params.orgId, req.body);

    if (organizer) {
        res.status(200).send(organizer);
    }
    else {
        res.sendStatus(400);
    }
})

router.put('/admin/:adminId/visitor/:visId/edit', adminAuth, async (req, res) => {
    if (req.params.adminId !== req.admin._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const visitor = await visitorRepository.editVisitor(req.params.visId, req.body);

    if (visitor) {
        res.status(200).send(visitor);
    }
    else {
        res.sendStatus(400);
    }
})

router.delete('/admin/:adminId/event/:eventId/delete', adminAuth, async (req, res) => {
    if (req.params.adminId !== req.admin._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const event = await eventRepository.deleteEvent(req.params.eventId);

    if (event) {
        res.status(200).send(event);
    }
    else {
        res.sendStatus(400);
    }
})

router.delete('/admin/:adminId/organizer/:orgId/delete', adminAuth, async (req, res) => {
    if (req.params.adminId !== req.admin._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const org = await organizerRepository.deleteOrganizer(req.params.orgId)

    if (org) {
        res.status(200).send(org)
    }
    else {
        res.sendStatus(400)
    }
})

router.delete('/admin/:adminId/visitor/:visId/delete', adminAuth, async (req, res) => {
    if (req.params.adminId !== req.admin._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const visitor = await visitorRepository.deleteVisitor(req.params.visId);

    if (visitor) {
        res.status(200).send(visitor)
    }
    else {
        res.sendStatus(400)
    }
})

router.get('/admin/:adminId/organizer/:orgId', adminAuth, async (req, res) => {
    if (req.params.adminId !== req.admin._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const org = await organizerRepository.getOrganizerById(req.params.orgId)

    if (org) {
        res.status(200).send(org)
    }
    else {
        res.sendStatus(400)
    }
})

router.get('/admin/:adminId/visitor/:visId', adminAuth, async (req, res) => {
    if (req.params.adminId !== req.admin._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const visitor = await visitorRepository.getVisitorById(req.params.visId);

    if (visitor) {
        res.status(200).send(visitor)
    }
    else {
        res.sendStatus(400)
    }
})
module.exports = router;