import { z } from 'zod';

/**
 * One schema, used by the browser form and the server route.
 *
 * `smartToken` is a honeypot — the reference ships the same idea under that
 * name. Real people never see the field, so anything in it is a bot.
 */
export const subscribeSchema = z.object({
  email: z.string().min(1).email(),
  smartToken: z.string().max(0).optional(),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
