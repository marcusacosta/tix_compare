const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const ticketmasterService = require('./ticketmaster');


/**
 * Notification service for sending SMS and email alerts
 * TODO: Implement the actual notification logic
 */

class NotificationService {
    constructor() {
        // Check if Twilio credentials are present
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            throw new Error('Missing Twilio credentials in .env file');
        }
        // Initialize your notification service here
        this.twilioClient = twilioClient;
        if (!this.twilioClient) {
            throw new Error('Twilio client not initialized');
        }
        this.defaultMessageTemplate = "Price Alert: {eventName} is now ${price}";
    }

    // TODO: Implement SMS sending
    async sendSMS(phone, eventName, price, eventUrl) {

        //verifying phone number and default message template
        if (!phone) throw new Error('Phone number is required');
        const message = this.defaultMessageTemplate
            .replace('{eventName}', eventName)
            .replace('{price}', price);
    
        const fullMessage = `${message}\n\nBuy here: ${eventUrl}`;

        // sending SMS and throwing error if it fails
        try {
            const res = await this.twilioClient.messages.create({
                to: phone,
                from: process.env.TWILIO_PHONE_NUMBER,
                body: fullMessage
            });
            return res; // Return the result
        } catch (error) {
            console.error('Error sending SMS:', error);
            throw new Error(`Failed to send SMS: ${error.message}`); // Better error message
        }
    }

    // TODO: Implement price alert notifications
    async sendPriceAlert(alert, event, pricing) {
        if (pricing.currentPrice < pricing.previousPrice) {
            const res = await this.sendSMS(alert.phone, event.name, pricing.currentPrice, event.url);
            return res;
        }
        return null;
    }
}

module.exports = new NotificationService();
