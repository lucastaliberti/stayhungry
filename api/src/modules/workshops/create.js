import _ from 'lodash'
import BCrypt from 'bcrypt';

export default async (app, req) => {

  const dbStayHungry = await app.mongodb(app, "StayHungry")
  const dbWorkshop = dbStayHungry.collection('workshops')

  const workshop = req.body;

  await app.utils.validateWorkshop(dbWorkshop, workshop)

  workshop.creator = req.user._id
  workshop.createdAt = new Date()

  const workshopCreated = await dbWorkshop.save(workshop)

  dbStayHungry.close()

  const createdWorkshop = _.first(_.get(workshopCreated, "ops", []))

  delete createdWorkshop.password

  return {
    code: 201,
    data: createdWorkshop
  };

}