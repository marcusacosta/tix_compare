# 🎫 tix-price-monitor

A Ticketmaster price comparison and monitoring app that helps you track ticket prices and get notified when prices drop or meet your budget.

## ✨ Features

- **Event Search**: Search events by keyword, city, and country
- **Price Monitoring**: Track ticket prices over time
- **Smart Alerts**: Get notified when prices drop or meet your threshold
- **Price History**: View price trends for charting
- **Real-time Updates**: Poll prices every 15 minutes (configurable)

## 🏗️ Project Structure

```
tix-price-monitor/
├─ src/
│  ├─ server.js              # Express app, mount routes, start poller
│  ├─ routes/
│  │  ├─ events.js           # GET /events/search, /events/:id, /events/:id/pricing, /events/:id/history
│  │  └─ alerts.js           # POST /alerts, GET /alerts, PUT /alerts/:id, DELETE /alerts/:id
│  ├─ services/
│  │  ├─ ticketmaster.js     # Discovery API calls + normalization
│  │  ├─ polling.js          # poll, snapshot, evaluate, notify
│  │  └─ notify.js           # sendSMS/sendEmail
│  ├─ db/
│  │  ├─ index.js            # pg client/pool
│  │  └─ schema.sql          # database schema
│  └─ utils/
│     └─ money.js            # cents<->dollars, safe rounding
├─ env.example               # Environment variables template
├─ package.json
└─ README.md
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Ticketmaster API key ([Get one here](https://developer-acct.ticketmaster.com/user/login))

### 2. Setup

```bash
# Clone and install dependencies
git clone <your-repo>
cd tix-price-monitor
npm install

# Copy environment template
cp env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Database Setup

```bash
# Create database
createdb tix_price_monitor

# Run schema
psql -d tix_price_monitor -f src/db/schema.sql
```

### 4. Start Development

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_NAME` | Database name | `tix_price_monitor` |
| `TICKETMASTER_API_KEY` | Your API key | **Required** |
| `POLL_INTERVAL_MINUTES` | Price check frequency | `15` |

### Database Schema

- **events**: Event information from Ticketmaster
- **alerts**: User alert subscriptions
- **price_snapshots**: Current pricing snapshots
- **price_history**: Historical pricing for charts

## 📡 API Endpoints

### Events

- `GET /api/events/search?keyword=concert&city=Boston` - Search events
- `GET /api/events/:eventId` - Get event details
- `GET /api/events/:eventId/pricing` - Get current pricing
- `GET /api/events/:eventId/history?days=30` - Get price history

### Alerts

- `POST /api/alerts` - Create price alert
- `GET /api/alerts` - List all alerts
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

## 🎯 Implementation Guide

### Phase 1: Core Services
1. **Ticketmaster Service** (`src/services/ticketmaster.js`)
   - Implement `searchEvents()` method
   - Implement `getEventDetails()` method
   - Implement `getCurrentPricing()` method

2. **Database Operations**
   - Add event to database when first searched
   - Implement price snapshot storage
   - Implement price history tracking

### Phase 2: Alert System
1. **Alert Management** (`src/routes/alerts.js`)
   - Implement alert creation/updating
   - Add duplicate alert prevention
   - Implement alert validation

2. **Notification Service** (`src/services/notify.js`)
   - Choose notification provider (Twilio, SendGrid, etc.)
   - Implement SMS/email sending
   - Add message templates

### Phase 3: Polling & Monitoring
1. **Polling Service** (`src/services/polling.js`)
   - Implement price snapshot logic
   - Add alert evaluation
   - Implement debouncing to prevent spam

2. **Price Analysis**
   - Calculate price drops
   - Track price trends
   - Generate insights

### Phase 4: Enhancement
1. **Price History Charts**
   - Implement data aggregation
   - Add chart endpoints
   - Consider real-time updates

2. **Advanced Features**
   - Multiple alert types
   - Alert scheduling
   - User authentication

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 📊 Monitoring

- Health check: `GET /health`
- Polling service status in logs
- Database connection monitoring

## 🔒 Security Considerations

- Validate all user inputs
- Rate limit API endpoints
- Secure database connections
- Protect API keys
- Implement proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests
5. Submit a pull request

## 📝 License

ISC License

## 🆘 Support

- Check the logs for error details
- Verify your Ticketmaster API key
- Ensure database is running and accessible
- Check environment variable configuration