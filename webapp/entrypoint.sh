#!/bin/sh
set -e

# Parse DATABASE_URL to extract connection details for waiting
if [ -n "$DATABASE_URL" ]; then
    DB_HOST=$(echo "$DATABASE_URL" | sed 's/.*@\([^:]*\):.*/\1/')
    DB_PORT=$(echo "$DATABASE_URL" | sed 's/.*:\([0-9]*\)\/.*/\1/')
    
    echo "Waiting for database at $DB_HOST:$DB_PORT to be ready..."
    until pg_isready -d "$DATABASE_URL"; do
        echo "Database not ready, waiting..."
        sleep 2
    done
    
    echo "Running database migrations..."
    dbmate up
    
    echo "Migrations completed successfully!"
else
    echo "WARNING: DATABASE_URL not set, skipping migrations"
fi

echo "Starting application..."
exec "$@"
