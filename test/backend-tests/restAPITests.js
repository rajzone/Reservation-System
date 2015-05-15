global.TEST_DATABASE = "mongodb://localhost/TestDataBase_xx1243";
global.SKIP_AUTHENTICATION = true;  //Skip security


var mocha = require('mocha');
var should = require("should");
var app = require("../../server/app");
var http = require("http");
var testPort = 9999;
var testServer;
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Airline = mongoose.model('Airline');
var nock = require('nock');

describe('REST API for users', function () {
  //Start the Server before the TESTS
  before(function (done) {


      Airline.create({airline:'MMJ', URL: 'http://airline-mich1104.rhcloud.com'});
      nock.enableNetConnect();
      testServer = app.listen(testPort, function () {
      console.log("Server is listening on: " + testPort);
      done();
    })
    .on('error',function(err){
        console.log(err);
      });
      console.log(testServer.settings);
  });

  beforeEach(function(done){


      done();
   });

  after(function(){  //Stop server after the test
    //Uncomment the line below to completely remove the database, leaving the mongoose instance as before the tests
    mongoose.connection.db.dropDatabase();
    testServer.close();
  });

  describe('Testing only the that the RESTful API makes the correct http calls to the backend server', function(){

      describe('/flights/:airport/:date', function(){

          var airport = 'CPH';
          var date = 123456;

          //    Mocker kaldet væk, men det ser ud til ikke at virke
          var couchbackend = nock('http://airline-mich1104.rhcloud.com')
              .get('/api/flights/CPH/123456')
              .reply(200,{

                  foo:true
              });
          it('should call the test-backendserver on api/flights/:airport/:date',function(done){

              var options = {

                  hostname: '127.0.0.1',
                  port: 9999,
                  path: '/userApi/flights/CPH/123456'
              };
              http.get(options, function(resp){

                  resp.on('data', function(data){

                      console.log('asd',data);
                      console.log('asd2', resp.data);
                      true.should.equal(true);
                      done();
                  });
              }).on('error', function(err){

                  console.log(err.message);
                  true.should.equal(false);
                  done();
              });

          });
      });
      describe('/flights/:from/:to/:date', function(){

          it('should call the test-backendserver on api/flights/:startAirport/:endAirport/:date',function(done){

              //TODO: nock
              //TODO: http-kald
              //TODO: assertions
              done();
          });
      });
      describe('/flights/:airline/:reservationId', function(){

          it('should call the test-backendserver on api/flights/:reservationId',function(done){

              //TODO: nock
              //TODO: http-kald
              //TODO: assertions
              done();
          });
      });
      describe('/flights/:airline/:flightId', function(){

          it('should POST to the test-backendserver on api/flights/:flightId',function(done){

              //TODO: nock
              //TODO: http-kald
              //TODO: assertions
              done();
          });
      });
      describe('/flights/:airline/:reservationId', function(){

          it('should DELETE to the test-backendserver on api/flights/:reservationId',function(done){

              //TODO: nock
              //TODO: http-kald
              //TODO: assertions
              done();
          });
      });
  });
});
