import MongoDB from 'mongodb';

export default async (app, req) => {

  const dbStayHungry = await app.mongodb(app, "StayHungry")
  const dbUser = dbStayHungry.collection('users')

  const user = await dbUser.findOne({
    _id: MongoDB.ObjectID.createFromHexString(req.params.id.toString())
  })

  dbStayHungry.close()

  return {
    code: 200,
    data: user
  };

}