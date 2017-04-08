import Create from './create'
import GetOne from './getOne'
import GetAll from './getAll'
import Update from './update'
import Delete from './delete'

export default (app) => {

  app
    .route('/users')
    .post((req, res) => app.utils.run(res, Create(app, req)))
    .get((req, res) => app.utils.run(res, GetAll(app, req)))
    
  app
    .route('/users/:id')
    .get((req, res) => app.utils.run(res, GetOne(app, req)))
    .put((req, res) => app.utils.run(res, Update(app, req)))
    .delete((req, res) => app.utils.run(res, Delete(app, req)))
    
};