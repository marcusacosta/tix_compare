require('dotenv').config();
const express = require('express');
const eventsRoutes = require('./src/routes/events');
const alertsRoutes = require('./src/routes/alerts');

const app = express();
app.use(express.json());

// API routes
app.use('/api/events', eventsRoutes);
app.use('/api/alerts', alertsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'tix-price-monitor'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 tix-price-monitor server running on port ${PORT}`);
    console.log('📝 All endpoints are ready for you to implement the logic');
});