import { z } from "zod";

const hostnameRegex = /^(?=.{1,253}$)(?!\-)([a-zA-Z0-9\-]{1,63}\.?)+(?!\d+$)[a-zA-Z]{2,63}$/;
const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|::)$/;

const forwardPortsFalse = z.object({
    forwardPorts: z.literal(false),
    port: z.string().nonempty(),
})

const forwardPortsTrue = z.object({
    forwardPorts: z.literal(true),
    portRange: z.string().nonempty().refine(
        val => {
            const segments = val.trim().split(/\s+/);
            return segments.every(segment => {
                if (/^\d+$/.test(segment)) {
                    const port = parseInt(segment, 10);
                    return port >= 1 && port <= 65535;
                }

                const match = segment.match(/^(\d+)-(\d+)$/);
                if (match) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [_, startStr, endStr] = match;
                    const start = parseInt(startStr, 10);
                    const end = parseInt(endStr, 10);
                    return (
                        start >= 1 && start <= 65535 &&
                        end >= 1 && end <= 65535 &&
                        start <= end
                    );
                }
                return false;
            })
        },
        { message: 'Port range must be valid' }
    ),
});

const tunnelHostFormSchema = z.object({
    protocol: z.string().nonempty(),
    address: z.string().nonempty().refine(
        val => { return hostnameRegex.test(val) || ipv4Regex.test(val) || ipv6Regex.test(val) },
        { message: 'Address must be valid ip or hostname' }
    ),
    identity: z.string().nonempty(),
    portConfig: z.discriminatedUnion('forwardPorts', [
        forwardPortsFalse,
        forwardPortsTrue
    ]),
});

export default tunnelHostFormSchema;
