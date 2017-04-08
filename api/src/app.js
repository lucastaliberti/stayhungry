import Express from 'express'
import Morgan from 'morgan'
import Helmet from 'helmet'
import BodyParser from 'body-parser'

import Config from './config/dev.config.json'
import MongoDB from './libs/mongodb'
import Utils from './libs/utils'

import Users from './modules/users'
import Auth from './modules/auth'
import Workshops from './modules/workshops'

const app = Express()

app.config = Config

app.use(Morgan('dev'))
app.use(Helmet())
app.use(BodyParser.json({limit: '512mb'}))

app.utils = new Utils()
app.mongodb = MongoDB

app.all("*", async (req, res, next) => {
  req.user = await app.utils.getLoggedUser(app, req, res)
  next()
})

Users(app)
Auth(app)
Workshops(app)

app.listen(app.config.port, () => {
  console.log(`User service listening on port ${app.config.port}!`)
});
