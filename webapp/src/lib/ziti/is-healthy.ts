import { get } from "./methods";

let lastCheckTime = 0;
let lastStatus: boolean | null = null;
const CHECK_INTERVAL = 60_000; // 60 seconds in ms

const isHealthy = async (): Promise<boolean> => {
    const now = Date.now();

    // If last check was within the interval, return cached result
    if (lastStatus !== null && now - lastCheckTime < CHECK_INTERVAL) {
        return lastStatus;
    }

    try {
        const res = (await get<object>({ route: '/' })) !== null;
        lastStatus = res;
        lastCheckTime = now;
        if (!res) console.error("ZITI IS NOT HEALTHY");
        return res;
    } catch (err) {
        lastStatus = false;
        lastCheckTime = now;
        console.error("ZITI IS NOT HEALTHY", err);
        return false;
    }
};

export default isHealthy;
