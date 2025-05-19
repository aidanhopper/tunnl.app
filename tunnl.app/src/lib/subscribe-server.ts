import { EventCallback, EventPayload, startEventListener } from '@/lib/db';

await startEventListener();

export type Payload = EventPayload;

export const subscribe = (id: string, regexp: RegExp, callback: EventCallback) => {
    if (global.pgEventListener && global.pgEventListener.handlers && global.pgEventListener.handlers.set)
        global.pgEventListener.handlers.set(id, { regexp, callback });

    return () => {
        if (global.pgEventListener && global.pgEventListener.handlers.delete)
            global.pgEventListener.handlers.delete(id);
    }
}

export const clearSubscribers = () => {
    if (global.pgEventListener && global.pgEventListener.handlers.clear)
        global.pgEventListener.handlers.clear();
}
