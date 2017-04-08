const ObjectID = require("mongodb").ObjectID
/*---------------------
	:: User
	-> controller
---------------------*/
var UserController = {

  index: (req, res) => {
    User.find((err, users) => {
      if (err) return res.send(err, 500);
      res.json(users)
    });
  },

  create: (req, res) => {
  	var params = _.extend(req.query || {}, req.params || {}, req.body || {});
  	User.create(params, (err, createdUser) => {
  		if (err) return res.send(err,500);
  		res.redirect('/user/show/'+ createdUser.id);
  	});
  },

  show: (req, res) => {
  	var id = req.param('id')
  	if (!id) return res.send("No id specified.", 500);
    User.findOne({_id: new ObjectID(id)}, (err, user) => {
  		if(err) return res.sender(err,500);
  		if(!user) return res.send("User "+id+" not found", 404);
  		res.json(user.toJSON())
    });
  }

};
module.exports = UserController;