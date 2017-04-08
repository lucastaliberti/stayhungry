/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    firstName: {
      type: 'string',
      defaultsTo: ''
    },
    lastName: {
      type: 'string',
      defaultsTo: ''
    },
    email: {
      type: 'string'
    },
    password: {
        type: 'string',
        minLength: 6,
        required: true
    },

    // Attribute methods
    getFullName: function (){
      return this.firstName + ' ' + this.lastName;
    },
    toJSON: function() {
        var obj = this.toObject();
        delete obj.password;
        return obj;
    },

  }
};

