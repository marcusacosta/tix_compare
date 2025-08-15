const router = require('express').Router();
const ticketmasterService = require('../services/ticketmaster');

// GET /events/search - Search events by keyword and optional city/country
router.get('/search', async (req, res) => {
    try {
        const { keyword, city} = req.query;
        const events = await ticketmasterService.searchEvents(keyword, city);
        res.json({ events });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /events/:eventId/pricing - Get current pricing for an event
router.get('/:eventId/pricing', async (req, res) => {
    // TODO: Implement pricing fetch
    res.json({ message: 'Event pricing endpoint - implement your logic here' });
});

// GET /events/:eventId/history - Get price history for an event (for charting)
router.get('/:eventId/history', async (req, res) => {
    // TODO: Implement price history fetch
    res.json({ message: 'Price history endpoint - implement your logic here' });
});

// GET /events/:eventId - Get event details and current pricing (MUST BE LAST)
router.get('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId; // Get from URL parameter
        const eventData = await ticketmasterService.validateEvent(eventId);
        const lowestPrice = await ticketmasterService.getCurrentPrice(eventId);
        
        res.json({
            eventId: eventId,
            hasEventData: !!eventData,
            lowestPrice: lowestPrice,
            message: 'All functions working!'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
