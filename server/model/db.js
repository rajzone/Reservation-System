var mongoose = require( 'mongoose' );

/* How To Create A User In Database */

/*
 Start your MongoDB database.
 Start mongo.exe and do:
 use database
 db.users.insert({username : "Mathias", password :"test", email: "kontakt@mathiaspedersen.dk", role: "admin", created : new Date()})
 */

var dbURI;

//This is set by the backend tests
if( typeof global.TEST_DATABASE != "undefined" ) {
  dbURI = global.TEST_DATABASE;
}
else{
  dbURI = 'mongodb://localhost/database';
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  global.mongo_error = "Not Connected to the Database";
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});


/* Schema for user */
var usersSchema = new mongoose.Schema({
  username : {type: String, unique: true},
  password: String,
  email: {type: String, unique: true},
  role: String,
  created: { type: Date, default: new Date() }
});

mongoose.model( 'User', usersSchema,"users" );