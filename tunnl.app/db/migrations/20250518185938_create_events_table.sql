-- migrate:up
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic VARCHAR(256) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger function to notify on insert
CREATE FUNCTION notify_event_insert() RETURNS trigger AS $$
BEGIN
    PERFORM pg_notify(
        'events',
        json_build_object(
            'topic', NEW.topic,
            'payload', NEW.payload
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to the events table
CREATE TRIGGER trigger_notify_event_insert
AFTER INSERT ON events
FOR EACH ROW EXECUTE FUNCTION notify_event_insert();

-- migrate:down
DROP TRIGGER trigger_notify_event_insert ON events;
DROP FUNCTION notify_event_insert;
DROP TABLE events;
