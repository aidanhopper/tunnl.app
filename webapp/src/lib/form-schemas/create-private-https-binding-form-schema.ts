import { z } from "zod";

const privateHttpsFormSchema = z.object({
    domain: z.string()
        .nonempty("Domain is required")
        .max(63, "Domain must be 63 characters or fewer")
        .regex(/^[a-zA-Z0-9]([-a-zA-Z0-9]*[a-zA-Z0-9])?$/, {
            message: "Must be a single-level domain (alphanumeric and dashes only, no dots)",
        })
});

export default privateHttpsFormSchema;
