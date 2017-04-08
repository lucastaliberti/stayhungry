import Create from './create'
import Get from './get'
import Delete from './delete'

export default (app) => {

  app
    .route('/auth')
    .post((req, res) => app.utils.run(res, Create(app, req)))
    .get((req, res) => app.utils.run(res, Get(app, req)))
    .delete((req, res) => app.utils.run(res, Delete(app, req)))

};