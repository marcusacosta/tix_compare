// routes/search.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// GET /search?keyword=concert&city=Boston
router.get('/search', async (req, res) => {
    const { keyword, city, countryCode, size, sort } = req.query;

    if (!keyword) {
        return res.status(400).json({ error: 'Missing keyword parameter' });
    }

    try {
        const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
            params: {
                apikey: process.env.TICKETMASTER_API_KEY,
                keyword,
                city,
                countryCode,
                size,
                sort
            }
        });

        // If no events are found
        if (!response.data._embedded || !response.data._embedded.events) {
            return res.json({ events: [], message: 'No events found for that keyword' });
        }

        // Return only the useful event data now, not the entire raw API response
        const events = response.data._embedded.events.map(event => ({
            name: event.name,
            date: event.dates.start.localDate,
            venue: event._embedded.venues[0].name,
            city: event._embedded.venues[0].city.name,
            url: event.url
        }));

        res.json({ events });

    } catch (error) {
        console.error('Error fetching from Ticketmaster:', error.message);
        res.status(500).json({ error: 'Failed to fetch from Ticketmaster' });
    }
});

module.exports = router;