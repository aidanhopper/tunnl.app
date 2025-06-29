import { z } from "zod";

const forwardPortsFalse = z.object({
    forwardPorts: z.literal(false),
    port: z.string().nonempty(),
})

const forwardPortsTrue = z.object({
    forwardPorts: z.literal(true),
    portRange: z.string().nonempty(),
});

const tunnelHostFormSchema = z.object({
    protocol: z.string().nonempty(),
    address: z.string().nonempty(),
    identity: z.string().nonempty(),
    init: z.discriminatedUnion('forwardPorts', [
        forwardPortsFalse,
        forwardPortsTrue
    ]),
});

export default tunnelHostFormSchema;
