import { z } from 'zod';

const identitySchema = z.object({
    name: z.string().min(2).max(128)
});

export default identitySchema;
