import MongoDB from 'mongodb';

export default async (app, req) => {

  const dbStayHungry = await app.mongodb(app, "StayHungry")
  const dbWorkshop = dbStayHungry.collection('workshops')

  const workshop = await dbWorkshop.findOne({
    _id: MongoDB.ObjectID.createFromHexString(req.params.id.toString())
  })

  workshop.deletedAt = new Date();

  dbWorkshop.save(workshop);
  dbStayHungry.close()

  return {
    code: 200,
    data: workshop
  };

}