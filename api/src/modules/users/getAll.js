export default async (app, req) => {

  const dbStayHungry = await app.mongodb(app, "StayHungry")
  const dbUser = dbStayHungry.collection('users')

  const userList = await dbUser.find({}).toArray()

  dbStayHungry.close()

  return {
    code: 200,
    data: userList
  };

}