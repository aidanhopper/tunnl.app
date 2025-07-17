interface IPublisher {
    publish<T>(topic: string, message: T): void
}

class ZitiPublisher implements IPublisher {
    private started = false;
    private interval = NodeJS.Timeout;

    publish<T>(topic: string, message: T) {
        console.log(topic, message);
    }

    start() {
        if (this.started) return;
        this.started = true;

        // this.interval = setInterval(async () => {
        //     const data = {
        //         message: 'hello world!'
        //     }
        //
        //     this.publish('hello', data);
        // }, 2000);
    }
}

let instance: ZitiPublisher | null = null;

export const getPublisher = () => {
    if (!instance) {
        instance = new ZitiPublisher();
    }
    return instance;
}
