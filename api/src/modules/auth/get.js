import { createClient } from 'then-redis'
import MongoDB from 'mongodb';

export default async (app, req) => {

  if (!req.headers.authorization) {
    throw ({
      code: 403,
      message: "Sessão não enviada"
    })
  }

  const redis = createClient()
  const userSession = await redis.get(req.headers.authorization);

  if(!userSession){
    throw ({
      code: 403,
      message: "Sessão não encontrada"
    })
  }

  const jsonSession = JSON.parse(userSession);

  const dbStayHungry = await app.mongodb(app, "StayHungry")
  const dbUser = dbStayHungry.collection('users')

  const user = await dbUser.findOne({
    _id: MongoDB.ObjectID.createFromHexString(jsonSession._id)
  })

  dbStayHungry.close()

  if(!user){
    throw ({
      code: 403,
      message: "Sessão inválida"
    })
  }

  delete user.password;

  await redis.expire(req.headers.authorization, app.config.session.ttl )
  await redis.quit()
  return {
    code: 200,
    data: user
  };

}