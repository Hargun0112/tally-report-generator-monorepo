import { createConfig } from '@trg_package/config-env';
import z from 'zod';

const EnvSchema = z.object({
  VITE_NODE_ENV: z.enum(['production', 'development', 'staging']),
  VITE_PORT: z.coerce.number(),
  VITE_DOMAIN: z.string(),
  VITE_TLD: z.string(),
  VITE_AUTH_SUBDOMAIN: z.string(),
  VITE_DASH_SUBDOMAIN: z.string()
});

const env = createConfig(EnvSchema, import.meta.env);

export default env;