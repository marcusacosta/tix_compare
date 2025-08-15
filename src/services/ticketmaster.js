const axios = require('axios');

class TicketmasterService {
    constructor() {
        this.apiKey = process.env.TICKETMASTER_API_KEY;
        if (!this.apiKey) {
            throw new Error('TICKETMASTER_API_KEY is required in your .env file');
        }
        this.baseUrl = 'https://app.ticketmaster.com/discovery/v2';
    }

    async searchEvents(eventName, city, date) {
        // Check parameters first
        if (!eventName) throw new Error('Event name is required');
        
        const searchParams = {
            apikey: this.apiKey,
            keyword: eventName,
            city: city,
            startDateTime: date,
        };
        
        // Correct API endpoint (no .json)
        const res = await axios.get(`${this.baseUrl}/events`, {params: searchParams});
        
        // Correct logic check
        if (!res.data._embedded || !res.data._embedded.events) return [];
        
        return res.data._embedded.events;
    }


 // Get current pricing for an event
    async getCurrentPrice(eventId) {
        // get event data using the validateEvent method
        const eventData = await this.validateEvent(eventId);
        // check if the event has a valid price range
        if (!eventData.priceRanges || eventData.priceRanges.length <= 0) {
            throw new Error('No pricing information available for this event');
        }
        // get the lowest price range
        let lowest_Price = eventData.priceRanges[0].min;
        
        for (let i = 0; i < eventData.priceRanges.length; i++) {
            const currPrice = eventData.priceRanges[i].min;
            if (currPrice < lowest_Price) {
                lowest_Price = currPrice;
            }
        }
       
        // return the lowest price
        return lowest_Price;
    }

}

module.exports = new TicketmasterService();
