export type Event<T> = {
    id: string;
    eventType: string;
    createdAt: Date;
    data: T;
}

export type ZitiCircuitEvent = Event<{
    zitiServiceId: string,
    zitiIdentityId: string
}>

