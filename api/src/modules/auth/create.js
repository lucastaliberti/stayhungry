import BCrypt from 'bcrypt'
import UUID from 'uuid'
import { createClient } from 'then-redis'

export default async (app, req) => {

  const dbStayHungry = await app.mongodb(app, "StayHungry")
  const dbUser = dbStayHungry.collection('users')
  const login = req.body;

  let user = await dbUser.findOne({
    email: login.email
  });

  dbStayHungry.close()

  if (user === null) {
    throw ({
      code: 400,
      message: "Usuário não encontrado."
    })
  }

  if (user.deletedAt) {
    throw ({
      code: 400,
      message: "Usuário desativado."
    })
  }

  if (!BCrypt.compareSync(login.password, user.password)) {
    throw ({
      code: 400,
      message: "Senha inválida."
    })
  }

  delete user.password

  const sessionId = UUID.v4()

  const redis = createClient()
  await redis.set(sessionId, JSON.stringify(user))
  await redis.expire(sessionId, app.config.session.ttl)
  await redis.quit()
  user.sessionId = sessionId

  return {
    code: 201,
    data: user
  };

}