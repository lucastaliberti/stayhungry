import { createClient } from 'then-redis'

export default async (app, req) => {

  const redis = createClient()
  const userSession = await redis.del(req.headers.authorization);
  await redis.quit()
  return {
    code: 204
  };

}