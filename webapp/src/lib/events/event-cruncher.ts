import { Pool } from "pg";
import pool from "../db";

export class EventCruncher {
    private pool: Pool;

    constructor() {
        this.pool = pool;
    }
}

// Export a single instance
export const eventCruncher = new EventCruncher();

// Option 3: Factory function (for dependency injection)
let eventCruncherInstance: EventCruncher | null = null;

const getEventCruncher = (): EventCruncher => {
    if (!eventCruncherInstance) {
        eventCruncherInstance = new EventCruncher();
    }
    return eventCruncherInstance;
}

export default getEventCruncher();
