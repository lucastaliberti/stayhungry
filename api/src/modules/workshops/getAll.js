export default async (app, req) => {

  const dbStayHungry = await app.mongodb(app, "StayHungry")
  const dbWorkshop = dbStayHungry.collection('workshops')

  const workshopList = await dbWorkshop.find({}).toArray()

  dbStayHungry.close()

  return {
    code: 200,
    data: workshopList
  };

}