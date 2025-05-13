import { getPublisher } from "@/lib/pubsub/publisher";

const publisher = getPublisher();

publisher.start();

console.log('here')
