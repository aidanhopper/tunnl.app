import { z } from "zod";

const hostnameRegex = /^(?=.{1,253}$)(?!\-)([a-zA-Z0-9\-]{1,63}\.?)+(?!\d+$)[a-zA-Z]{2,63}$/;

const forwardPortsFalse = z.object({
    forwardPorts: z.literal(false),
    port: z.string().nonempty()
});

const forwardPortsTrue = z.object({
    forwardPorts: z.literal(true)
});

const tunnelInterceptFormSchema = z.object({
    address: z.string().nonempty().refine(val => hostnameRegex.test(val.trim()), { message: 'Address must be valid' }),
    portConfig: z.discriminatedUnion('forwardPorts', [
        forwardPortsFalse,
        forwardPortsTrue,
    ])
});

export default tunnelInterceptFormSchema;
