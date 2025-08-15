-- Database schema for tix-price-monitor

-- Events table to store event information
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) UNIQUE NOT NULL, -- Ticketmaster event ID
    name VARCHAR(500) NOT NULL,
    date_time TIMESTAMP NOT NULL,
    venue VARCHAR(500),
    city VARCHAR(255),
    country_code VARCHAR(10),
    url TEXT NOT NULL,
    has_price_ranges BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table for user subscriptions
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL REFERENCES events(event_id),
    email VARCHAR(255),
    phone VARCHAR(20),
    threshold_cents INTEGER, -- notify when price <= threshold
    drop_pct DECIMAL(5,2), -- notify when price drops >= X%
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Price snapshots for current pricing
CREATE TABLE IF NOT EXISTS price_snapshots (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL REFERENCES events(event_id),
    min_price_cents INTEGER NOT NULL,
    max_price_cents INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',
    snapshot_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Price history for charting
CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL REFERENCES events(event_id),
    min_price_cents INTEGER NOT NULL,
    max_price_cents INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_event_id ON events(event_id);
CREATE INDEX IF NOT EXISTS idx_alerts_event_id ON alerts(event_id);
CREATE INDEX IF NOT EXISTS idx_price_snapshots_event_id ON price_snapshots(event_id);
CREATE INDEX IF NOT EXISTS idx_price_history_event_id ON price_history(event_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
