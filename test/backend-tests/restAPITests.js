global.TEST_DATABASE = "mongodb://localhost/TestDataBase_xx1243";
global.SKIP_AUTHENTICATION = true;  //Skip security

var should = require("should");
var app = require("../../server/app");
var http = require("http");
var testPort = 9999;
var testServer;
var mongoose = require("mongoose");
var User = mongoose.model("User");
var nock = require('nock');

describe('REST API for users', function () {
  //Start the Server before the TESTS
  before(function (done) {

    testServer = app.listen(testPort, function () {
      console.log("Server is listening on: " + testPort);
      done();
    })
    .on('error',function(err){
        console.log(err);
      });
  })

  beforeEach(function(done){

      //TODO: setup the testbackendservers in the DB
      /**
       * {
       *    airline: String,
       *    hostname: String
       *
       * }
       *
       * **/
  })

  after(function(){  //Stop server after the test
    //Uncomment the line below to completely remove the database, leaving the mongoose instance as before the tests
    //mongoose.connection.db.dropDatabase();
    testServer.close();
  })

  describe('Testing only the that the RESTful API makes the correct http calls to the backend server', function(){

      describe('/flights/:airport/:date', function(){

          it('should call the test-backendserver on api/flights/:airport/:date',function(){

              //TODO: nock
              //TODO: http-kald
              //TODO: assertions
          });
      });
      describe('/flights/:from/:to/:date', function(){

          it('should call the test-backendserver on api/flights/:startAirport/:endAirport/:date',function(){

              //TODO: nock
              //TODO: http-kald
              //TODO: assertions
          });
      });
      describe('/flights/:airline/:reservationId', function(){

          it('should call the test-backendserver on api/flights/:reservationId',function(){

              //TODO: nock
              //TODO: http-kald
              //TODO: assertions
          });
      });
      describe('/flights/:airline/:flightId', function(){

          it('should POST to the test-backendserver on api/flights/:flightId',function(){

              //TODO: nock
              //TODO: http-kald
              //TODO: assertions
          });
      });
      describe('/flights/:airline/:reservationId', function(){

          it('should DELETE to the test-backendserver on api/flights/:reservationId',function(){

              //TODO: nock
              //TODO: http-kald
              //TODO: assertions
          });
      });
  });
});
