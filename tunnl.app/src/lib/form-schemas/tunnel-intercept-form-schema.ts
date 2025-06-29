import { z } from "zod";

const forwardPortsFalse = z.object({
    forwardPorts: z.literal(false),
    port: z.string().nonempty()
});

const forwardPortsTrue = z.object({
    forwardPorts: z.literal(true)
});

const tunnelInterceptFormSchema = z.object({
    address: z.string().nonempty(),
    init: z.discriminatedUnion('forwardPorts', [
        forwardPortsFalse,
        forwardPortsTrue,
    ])
})

export default tunnelInterceptFormSchema;
