-- migrate:up
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Essential indexes for performance
CREATE INDEX idx_events_type_created ON events(event_type, created_at);
CREATE INDEX idx_events_created_id ON events(created_at, id);

-- Flexible indexes for external service identifiers
CREATE INDEX idx_events_identity_id ON events ((data->>'identity_id'));
CREATE INDEX idx_events_service_id ON events ((data->>'service_id'));

-- General JSONB index for other nested lookups
CREATE INDEX idx_events_data_gin ON events USING GIN (data);

-- Composite index for events that have both key identifiers
CREATE INDEX idx_events_ids_type ON events(event_type) 
WHERE data ? 'identity_id' OR data ? 'service_id';

-- migrate:down
DROP INDEX idx_events_ids_type;
DROP INDEX idx_events_data_gin;
DROP INDEX idx_events_service_id;
DROP INDEX idx_events_identity_id;
DROP INDEX idx_events_created_id;
DROP INDEX idx_events_type_created;

DROP TABLE events;
