const express = require('express');
const router = express.Router();
const { EventRepository } = require('../services/event-repository');
const orgAuth = require('../middlewares/organizer-auther');
const { EventLocationRepository } = require('../services/eventlocation-repository');

const eventRepository = new EventRepository();
const eventLocationRepository = new EventLocationRepository();

router.get('/event', async (req, res) => {
    const events = await eventRepository.getAllEvents();

    if (events) {
        res.status(200).send(events);
    }
    else {
        res.sendStatus(400);
    }
});

router.get('/event/:eventId/visitor/:visitorId', async (req, res) => {
    const visitor = await eventRepository.getVisitorOnEvent(req.params.visitorId, req.params.eventId);

    if (visitor) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
});

router.get('/event/:eventId/locations', async (req, res) => {
    const eventLocations = await eventLocationRepository.getLocationsOfEvent(req.params.eventId);

    if (eventLocations) {
        res
            .status(200)
            .send(eventLocations);
    }
    else {
        res.sendStatus(400);
    }
})

router.get('/event/:eventId/visitor/:visitorId/getVisits', async (req, res) => {
    const visits = await eventRepository.getAllVisitsOfEventByVisitor(req.params.eventId, req.params.visitorId)

    if (visits) {
        res.status(200).send(visits)
    }
    else {
        res.sendStatus(400)
    }
})

router.post('/eventLocation/:id/visitor', async (req, res) => {
    const locationVisit = await eventRepository.setVisitOnLocation(req.params.id, req.body);

    if (locationVisit) {
        res.status(200).send(locationVisit);
    }
    else {
        res.sendStatus(400);
    }
});

router.get('/eventLocation/:id', async (req, res) => {
    const location = await eventLocationRepository.getLocationById(req.params.id);

    if (location) {
        res.status(200).send(location);
    }
    else {
        res.sendStatus(400);
    }
})

router.get('/event/:id/visits', async (req, res) => {
    const visits = await eventRepository.getVisitsOfEvent(req.params.id);

    if (visits) {
        res.status(200).send(visits);
    }
    else {
        res.sendStatus(400);
    }
})

module.exports = router;