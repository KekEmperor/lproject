const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { VisitorRepository } = require('../services/visitor-repository');
const { Visitor } = require('../models/visitor-model');
const visAuth = require('../middlewares/visitor-auther');

const visitorRepository = new VisitorRepository();

router.post('/visitor', async (req, res) => {
    let visitor = await Visitor.findOne({ phoneNumber: req.body.phoneNumber });

    if (visitor) {
        return res
            .status(400)
            .send('This phone number is already registered');
    }

    visitor = await visitorRepository.registerVisitor(req.body);

    const token = visitor.generateAuthToken();

    if (visitor) {
        res
            .header('x-auth-token', token)
            .status(201)
            .send(visitor);
    }
    else {
        res.send(400);
    }
});

router.post('/visitor/login', async (req, res) => {
    const visitor = await Visitor.findOne({ phoneNumber: req.body.phoneNumber });

    if (!visitor) {
        return res
            .status(404)
            .send('No users were found by this phone number');
    }

    if (await bcrypt.compare(req.body.password, visitor.password)) {
        const token = visitor.generateAuthToken();
        res
            .header('x-auth-token', token)
            .status(200)
            .send({
                visitorId: visitor._id,
                token: token
            });
    }
    else {
        res
            .status(401)
            .send('Wrong password');
    }
});

router.get('/visitor/:id', visAuth, async (req, res) => {
    if (req.params.id !== req.visitor._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const visitor = await visitorRepository.getVisitorById(req.params.id)

    if (visitor) {
        return res.status(200).send(visitor)
    }
    else {
        return res.sendStatus(404)
    }
})

router.post('/visitor/:id/setEvent', visAuth, async (req, res) => {
    if (req.params.id !== req.visitor._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const visitorForEvent = await visitorRepository.setVisitorForEvent(req.params.id, req.body.eventId);

    if (visitorForEvent) {
        res
            .status(200)
            .send(visitorForEvent);
    }
    else {
        res.send(400);
    }
})

router.get('/visitor', async (req, res) => {
    const visitors = await visitorRepository.getAllVisitors()

    if (visitors) {
        res
            .status(200)
            .send(visitors);
    }
    else {
        res.send(400);
    }
})

module.exports = router;