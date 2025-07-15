import { z } from 'zod';

const identitySchema = z.object({
    name: z.string().min(4).max(128)
});

export default identitySchema;
