const { EventRepository } = require('../services/event-repository');
const { EventLocationRepository } = require('../services/eventlocation-repository');

const eventRepository = new EventRepository();
const eventLocationRepository = new EventLocationRepository();

class LogicProvider {
    async getVisitsByLocations(eventId) {
        const visits = await eventRepository.getVisitsOfEvent(eventId);

        const locations = await (await eventLocationRepository.getLocationsOfEvent(eventId))
            .map(l => l._id);

        let locationsDict = new Object();

        locations.forEach(l => {
            locationsDict[l.toString()] = [];
            visits.forEach(v => {
                if (v.location._id.toString() == l.toString()) {
                    locationsDict[l].push(v);
                }
            })
        });

        return locationsDict;
    }

    async getVisitsOfStages(eventId) {
        let stagesDict = await this.getVisitsByLocations(eventId);
        for (var key in stagesDict) {
            const location = await eventLocationRepository.getLocationById(key);
            if (location.type != "Stage") {
                delete stagesDict[key];
            }
        }

        return stagesDict;
    }

    async getVisitsOfShops(eventId) {
        let shopsDict = await this.getVisitsByLocations(eventId);

        for (var key in shopsDict) {
            const location = await eventLocationRepository.getLocationById(key);
            if (location.type != "Shop") {
                delete shopsDict[key];
            }
        }

        return shopsDict;
    }

    async getAverageTimeByStage(eventId) {
        const stagesDict = await this.getVisitsOfStages(eventId);
        let timeResult = {};

        for (var key in stagesDict) {
            let timeSum = 0;
            let visitsAmount = stagesDict[key].length;

            stagesDict[key].forEach(v => {
                let startTime = Date.parse(v.startTime);
                let finishTime = Date.parse(v.finishTime);
                timeSum += (finishTime - startTime);
            })

            let locationAverageTime =
                visitsAmount == 0 ? 0 : timeSum / visitsAmount / 1000;

            timeResult[key] = locationAverageTime;
        }

        return timeResult;
    }

    async getUniqueVisitors(eventId) {
        let visitors = await this.getVisitsByLocations(eventId);

        for (var key in visitors) {
            visitors[key] = visitors[key].map(v => v.visitor);
            let uniqueVisitorIds = []
            let uniqueVisitors = []
            visitors[key].forEach(v => {
                if (uniqueVisitorIds.indexOf(v._id.toString()) < 0) {
                    uniqueVisitorIds.push(v._id.toString());
                    uniqueVisitors.push(v);
                }
            })
            visitors[key] = uniqueVisitors;
        }

        return visitors;
    }

    async getVisitorsNumber(eventId) {
        let visitors = await this.getUniqueVisitors(eventId);
        let result = [];

        for (var key in visitors) {
            visitors[key] = visitors[key].map(v => v._id);
            visitors[key].forEach(id => {
                if (result.indexOf(id.toString()) < 0) {
                    result.push(id);
                }
            })
        }

        return result.length;
    }

    async getStatisticsByGender(eventId) {
        let visitors = await this.getUniqueVisitors(eventId);
        let statDict = {}

        for (var key in visitors) {
            statDict[key] = { menPercent: 0, womenPercent: 0 }
            let visitorsAmount = visitors[key].length;
            let menAmount = 0;
            let womenAmount = 0;

            visitors[key].forEach(v => {
                if (v.gender == 'W') {
                    womenAmount++;
                }
                else {
                    menAmount++;
                }
            })

            if (visitorsAmount != 0) {
                statDict[key].menPercent = Math.round(menAmount / visitorsAmount * 100);
                statDict[key].womenPercent = Math.round(womenAmount / visitorsAmount * 100);
            }
        }

        return statDict;
    }

    async getStatisticsByAge(eventId) {
        let visitors = await this.getUniqueVisitors(eventId);
        let statDict = {}

        for (var key in visitors) {
            statDict[key] = { under30: 0, from30to50: 0, over50: 0 }

            let visitorsAmount = visitors[key].length;
            let under30Amount = 0;
            let from30to50Amount = 0;
            let over50Amount = 0;

            visitors[key].forEach(v => {
                const age = new Date().getFullYear() - parseInt(v.birthYear)
                if (age < 30) {
                    under30Amount++;
                }
                else if (age >= 30 && age <= 50) {
                    from30to50Amount++;
                }
                else {
                    over50Amount++;
                }
            })

            if (visitorsAmount != 0) {
                statDict[key].under30 = Math.round(under30Amount / visitorsAmount * 100);
                statDict[key].from30to50 = Math.round(from30to50Amount / visitorsAmount * 100);
                statDict[key].over50 = Math.round(over50Amount / visitorsAmount * 100);
            }
        }

        return statDict;
    }

    async getTimelines(eventId) {
        const dictionary = await this.getVisitsOfStages(eventId);
        let timelineDict = {};

        for (var key in dictionary) {
            let timeSet = [];
            let timeline = [];

            dictionary[key].forEach(v => {
                timeSet.push({
                    time: Date.parse(v.startTime),
                    stringTime: v.startTime,
                    type: 'start'
                });
                timeSet.push({
                    time: Date.parse(v.finishTime),
                    stringTime: v.finishTime,
                    type: 'finish'
                });
            })

            let currentAmount = 0;
            timeSet.sort((a, b) => a.time - b.time);

            timeSet.forEach(t => {
                t.type == 'start'
                    ? currentAmount++
                    : currentAmount--;

                timeline.push({
                    time: t.time,
                    stringTime: t.stringTime,
                    amount: currentAmount
                });
            });

            timelineDict[key] = timeline;
        }

        return timelineDict;
    }
}

exports.LogicProvider = LogicProvider;