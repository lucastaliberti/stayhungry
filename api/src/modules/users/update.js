export default async (app, req) => {

  const dbStayHungry = await app.mongodb(app, "StayHungry")
  const dbUser = dbStayHungry.collection('users')

  const body = req.body
  const user = await dbUser.findOne({
    alias: req.params.alias
  })

  if (!body.name) {
    throw ({
      code: 400,
      message: "O campos 'nome' é obrigatório."
    })
  }

  if (!user.email) {
    throw ({
      code: 400,
      message: "O campos 'E-mail' é obrigatório."
    })
  }

  user.name = body.name

  dbUser.save(user);
  dbStayHungry.close()

  return {
    code: 200,
    data: user
  };

}