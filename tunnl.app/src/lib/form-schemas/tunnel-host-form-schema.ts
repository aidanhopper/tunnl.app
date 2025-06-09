import { z } from "zod";

const tunnelHostFormSchema = z.object({
    protocol: z.string().nonempty(),
    address: z.string().nonempty(),
    port: z.string().nonempty(),
    identity: z.string().nonempty()
});

export default tunnelHostFormSchema;
