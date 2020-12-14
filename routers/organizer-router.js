const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { OrganizerRepository } = require('../services/organizer-repository');
const { Organizer } = require('../models/organizer-model');
const orgAuth = require('../middlewares/organizer-auther');
const { EventRepository } = require('../services/event-repository');
const { EventLocationRepository } = require('../services/eventlocation-repository');
const { LogicProvider } = require('../business_logic/logic-provider');

const eventRepository = new EventRepository();
const organizerRepository = new OrganizerRepository();
const eventLocationRepository = new EventLocationRepository();
const logicProvider = new LogicProvider();

router.post('/organizer', async (req, res) => {
    let organizer = await Organizer.findOne({ email: req.body.email });

    if (organizer) {
        return res
            .status(400)
            .send('This email is already registered');
    }

    organizer = await organizerRepository.registerOrganizer(req.body);

    const token = organizer.generateAuthToken()

    if (organizer) {
        res
            .header('x-auth-token', token)
            .status(201)
            .send(organizer);
    }
    else {
        res.send(400);
    }
});

router.post('/organizer/login', async (req, res) => {
    const organizer = await Organizer.findOne({ email: req.body.email });

    if (!organizer) {
        return res
            .status(404)
            .send('No users were found by this email');
    }

    if (await bcrypt.compare(req.body.password, organizer.password)) {
        const token = organizer.generateAuthToken();
        res
            .header('x-auth-token', token)
            .status(200)
            .send({
                organizerId: organizer._id,
                token: token
            });
    }
    else {
        res
            .status(401)
            .send('Wrong password');
    }
});

router.post('/organizer/:id/events', orgAuth, async (req, res) => {
    if (req.params.id !== req.organizer._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const event = await eventRepository.createEvent(req.params.id, req.body);

    if (event) {
        res
            .status(200)
            .send(event);
    }
    else {
        res.sendStatus(400);
    }
});

router.get('/organizer/:id/events', orgAuth, async (req, res) => {
    if (req.params.id !== req.organizer._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const events = await eventRepository.getEventsByOrganizer(req.params.id);

    if (events) {
        res
            .status(200)
            .send(events);
    }
    else {
        res.sendStatus(404);
    }
});

router.get('/organizer/:orgId/event/:eventId', orgAuth, async (req, res) => {
    if (req.params.orgId !== req.organizer._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const event = await eventRepository.getEventById(req.params.eventId);

    if (event) {
        res
            .status(200)
            .send(event);
    }
    else {
        res.sendStatus(400);
    }
});

router.post('/organizer/:orgId/event/:eventId', orgAuth, async (req, res) => {
    if (req.params.orgId !== req.organizer._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const eventLocation = await eventLocationRepository.createEventLocation(req.params.eventId, req.body);

    if (eventLocation) {
        res
            .status(200)
            .send(eventLocation);
    }
    else {
        res.sendStatus(400);
    }
});

router.get('/organizer/:orgId/event/:eventId/locations', orgAuth, async (req, res) => {
    if (req.params.orgId !== req.organizer._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const eventLocations = await eventLocationRepository.getLocationsOfEvent(req.params.eventId);

    if (eventLocations) {
        res
            .status(200)
            .send(eventLocations);
    }
    else {
        res.sendStatus(400);
    }
});

router.get('/organizer/:orgId/event/:eventId/stat/count', orgAuth, async (req, res) => {
    if (req.params.orgId !== req.organizer._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const result = await logicProvider.getVisitorsNumber(req.params.eventId);

    if (result || result === 0) {
        res.status(200).send("" + result);
    }
    else {
        res.sendStatus(400);
    }
})

router.get('/organizer/:orgId/event/:eventId/stat/timelines', orgAuth, async (req, res) => {
    if (req.params.orgId !== req.organizer._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    await eventRepository.normalizeVisits(req.params.eventId);

    const result = await logicProvider.getTimelines(req.params.eventId);

    if (result) {
        res.status(200).send(result);
    }
    else {
        res.sendStatus(400);
    }
});

router.get('/organizer/:orgId/event/:eventId/stat/ages', orgAuth, async (req, res) => {
    if (req.params.orgId !== req.organizer._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const result = await logicProvider.getStatisticsByAge(req.params.eventId);

    if (result) {
        res.status(200).send(result);
    }
    else {
        res.sendStatus(400);
    }
});

router.get('/organizer/:orgId/event/:eventId/stat/genders', orgAuth, async (req, res) => {
    if (req.params.orgId !== req.organizer._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const result = await logicProvider.getStatisticsByGender(req.params.eventId);

    if (result) {
        res.status(200).send(result);
    }
    else {
        res.sendStatus(400);
    }
});

router.get('/organizer/:orgId/event/:eventId/stat/averageTime', orgAuth, async (req, res) => {
    if (req.params.orgId !== req.organizer._id) {
        return res
            .status(403)
            .send('Access denied');
    }

    const result = await logicProvider.getAverageTimeByStage(req.params.eventId);

    if (result) {
        res.status(200).send(result);
    }
    else {
        res.sendStatus(400);
    }
});

module.exports = router;