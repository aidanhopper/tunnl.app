import { z } from 'zod';

const serviceSchema = z.object({
    name: z.string().min(4).max(100),
    protocol: z.enum(['http', 'tcp/udp']),
});

export default serviceSchema;
