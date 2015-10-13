module.exports.connections = {
  // mongo: {
  //   module: 'sails-mongo',
  //   host: 'localhost',
  //   port: 27017,
  //   user: '',
  //   password: '',
  //   database: 'test'
  // }
  mongo: {
    adapter: 'sails-mongo',
    url: process.env.MONGOLAB_URI,
    schema : true
  }

  
};

