import _ from 'lodash'
import BCrypt from 'bcrypt';

export default async (app, req) => {

  const dbStayHungry = await app.mongodb(app, "StayHungry")
  const dbUser = dbStayHungry.collection('users')
  const salt = BCrypt.genSaltSync()
  const user = req.body;

  await app.utils.validateUser(dbUser, user)

  user.createdAt = new Date()
  user.password = BCrypt.hashSync(user.password, salt)
  const userCreated = await dbUser.save(user)

  dbStayHungry.close()

  const createdUser = _.first(_.get(userCreated, "ops", []))

  delete createdUser.password

  return {
    code: 201,
    data: createdUser
  };

}