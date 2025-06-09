import { z } from "zod";

const tunnelInterceptFormSchema = z.object({
    address: z.string().nonempty(),
    port: z.string().nonempty()
})

export default tunnelInterceptFormSchema;
