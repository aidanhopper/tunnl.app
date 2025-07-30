import { Pool } from "pg";
import { EventEnricher } from "./event-enricher";
import { EventCruncher } from "./event-cruncher";
import pool from "../db";

class EventParser {
    private eventEnricher: EventEnricher;
    private eventCrucher: EventCruncher;

    constructor(pool: Pool) {
        this.eventEnricher = new EventEnricher(pool);
        this.eventCrucher = new EventCruncher(pool);
    }

    async getZitiCircuitCreatedEvents({
        zitiServiceId,
        interval
    }: {
        zitiServiceId: string,
        interval: string
    }) {
        const events = await this.eventCrucher.getZitiCircuitCreatedEvents({
            zitiServiceId,
            interval
        });
        const enrichedEvents = await Promise.all(
            events.map(e => this.eventEnricher.enrichZitiCircuitEvent(e)));
        return enrichedEvents.filter(e => e !== null);
    }
}


// Export a single instance
export const eventParser = new EventParser(pool);

export default eventParser;
