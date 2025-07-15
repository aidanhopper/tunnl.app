import { z } from "zod";

const tunnelShareFormSchema = z.object({
    type: z.string().nonempty()
});

export default tunnelShareFormSchema;
