import { createClient } from 'then-redis'
import MongoDB from 'mongodb'

export default class {

  httpResponse(res, body) {
    return res.status(body.code).json(body.data);
  }

  httpError(res, body) {
    return res.status(body.code).json(body.message);
  }

  run(res, promise){
    promise
      .then(result => this.httpResponse(res, result))
      .catch(error => this.httpError(res, error));
  }

  async getLoggedUser(app, req, res){

    if (!req.headers.authorization) {
      return undefined
    }

    const redis = createClient()
    const userSession = await redis.get(req.headers.authorization);

    if(!userSession){
      return undefined
    }

    const jsonSession = JSON.parse(userSession);

    const dbStayHungry = await app.mongodb(app, "StayHungry")
    const dbUser = dbStayHungry.collection('users')

    const user = await dbUser.findOne({
      _id: MongoDB.ObjectID.createFromHexString(jsonSession._id)
    })

    dbStayHungry.close()

    if(!user){
      return undefined
    }

    delete user.password;

    await redis.expire(req.headers.authorization, app.config.session.ttl)
    await redis.quit()

    return user

  }

  isAuth (req, res, next) {
    if (!req.user) {
      return this.httpError(res, {
        code: 403,
        message: "Acesso Negado"
      })
    }
    next();
  }

  async validateUser(dbUser, user){
    if (!user.name) {
      throw ({
        code: 400,
        message: "O campo 'Nome' é obrigatório."
      })
    }

    if (!user.email) {
      throw ({
        code: 400,
        message: "O campo 'E-mail' é obrigatório."
      })
    }

    if (!user.password) {
      throw ({
        code: 400,
        message: "O campo 'Senha' é obrigatório."
      })
    }

    const query = {email: user.email}
    if (user._id){
      query._id = user._id
    }

    const uniqUser = await dbUser.findOne(query);

    if(uniqUser){
      throw ({
        code: 400,
        message: "Já existe um usuário cadastrado com este E-Mail."
      })
    }

  }

  async validateWorkshop(dbUser, workshop){
    if (!workshop.title) {
      throw ({
        code: 400,
        message: "O campo 'Título' é obrigatório."
      })
    }
  }

};
