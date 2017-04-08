import MongoDB from 'mongodb';

export default async (app, base) => {
  const db = app.config.mongo[base]
  //const url = `mongodb://${db.user}:${db.pass}@${db.host}:${db.port}/${db.base}`
  const url = `mongodb://${db.host}:${db.port}/${db.base}`
  return await MongoDB.MongoClient.connect(url)
}