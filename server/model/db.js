var mongoose = require('mongoose');

/* How To Create A User In Database */

/*
 Start your MongoDB database.
 Start mongo.exe and do:
 use database
 db.users.insert({username : "Mathias", password :"test", email: "kontakt@mathiaspedersen.dk", role: "admin", created : new Date()})
 */

/*
MongoLab credentials
Username: admin
Password: pass
*/

var dbURI;

//This is set by the backend tests
if (typeof global.TEST_DATABASE != "undefined") {
    dbURI = global.TEST_DATABASE;
}
else {
    dbURI = 'mongodb://admin:pass@ds047948.mongolab.com:47948/semesterprojekt';
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
    global.mongo_error = "Not Connected to the Database";
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});


/*=================User Schema=================*/

/*Properties required to create user in database
* Username, Password, verified & Email */

var usersSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    role: {type: String, default: 'user'},
    verified: {type: String, required: true},
    created: {type: Date, default: new Date()}
}, {versionKey: false});

var airlineSchema = new mongoose.Schema({
    airline: {type:String, unique: true, required:true},
    URL: {type:String, unique:true, required:true}
});
mongoose.model('User', usersSchema, "users");
mongoose.model('Airline', airlineSchema, "airlines");