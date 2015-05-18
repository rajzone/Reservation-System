var express = require('express');
var http = require('http');
var request = require('request');
var mongoose = require('mongoose');
var Airlines = mongoose.model('Airline');

var restPath = '/api/flights/';


var router = express.Router();
router.get('/test', function(req, res) {
    res.header("Content-type","application/json");
    res.end('{"msg" : "Test Message fetched from the server, You are logged on as a User since you could fetch this data"}');
});

router.get('/flights/:airport/:date', function(req,res){


    var jsonArr = [];
    res.setHeader('Content-Type', 'application/json');
    Airlines.find({}, function(err, airlines){

        console.log('asd airlines from mongo:', airlines);
        if(err){
            var msg = {
                code: 500,
                msg: err.message
            };
            res.end(JSON.stringify(msg));
        }else if(typeof airlines == 'undefined'||airlines==null){

            var msg = {
                code: 500,
                msg: 'No servers found'
            };
            res.end(JSON.stringify(msg));
        }else{
            console.log('asd REST_userblah else');
            var counter = 0;
            var totalAirlines = airlines.length;
            airlines.forEach(function(element){

                console.log('asd element airlines',element);
                var options = {

                    host: element.URL,
                    path: restPath+req.params.airport+'/'+req.params.date
                };
                var getURL = options.host+restPath+req.params.airport+'/'+req.params.date
                console.log('asd path: '+options.path+' on '+options.host+': ' + getURL+': getURL');
                request(getURL, function(error,response,body){

                    console.log(body);
                    if(!error){
                        var bodyArr = JSON.parse(body);
                        bodyArr.forEach(function(element){

                            console.log(element);
                            jsonArr.push(element);
                        });
                        res.end(JSON.stringify(jsonArr));
                        console.log(jsonArr,'jsonArr');
                    }
                });

            });

            console.log(jsonArr+'jsonArr');
        }
    });
});

router.get('/flights/:from/:to/:date', function(req,res){

    var jsonArr = [];
    res.setHeader('Content-Type', 'application/json');
    Airlines.find({}, function(err, airlines){

        console.log('asd airlines from mongo:', airlines);
        if(err){
            var msg = {
                code: 500,
                msg: err.message
            };
            res.end(JSON.stringify(msg));
        }else if(typeof airlines == 'undefined'||airlines==null){

            var msg = {
                code: 500,
                msg: 'No servers found'
            };
            res.end(JSON.stringify(msg));
        }else{
            console.log('asd REST_userblah else');
            var counter = 0;
            var totalAirlines = airlines.length;
            airlines.forEach(function(element){

                console.log('asd element airlines',element);
                var options = {

                    host: element.URL,
                    path: restPath+req.params.from+'/'+req.params.to+'/'+req.params.date
                };
                console.log('asd path: '+options.path+' on '+options.host+': ');
                http.get(options, function(resp){
                    console.log('asd host: ', options);
                    resp.on('data', function(body){

                        console.log('asd body:'+body);
                        body.forEach(function(flight){

                            jsonArr.push(flight);
                            console.log('asd',jsonArr);
                        });
                        counter++;
                    });
                }).on('error', function(e){
                    counter++;
                    console.log('Error getting '+options.path+' on '+options.host+': '+ e);
                });
            });
            var respond = true;
            while(respond){
                if(counter === totalAirlines){
                    res.end(JSON.stringify(jsonArr));
                    respond = false;
                }
            }
        }
    });
});

router.post('/reservation/:airline/:flightId', function(req,res){

    res.setHeader('Content-Type', 'application/json');
    Airlines.findOne({airline: req.params.airline}, function(err, airline){

        if(err){
            var msg = {
                code: 500,
                msg: err.message
            };
            res.end(JSON.stringify(msg));
        }else if(typeof airline == 'undefined'||airline==null){

            var msg = {
                code: 404,
                msg: 'Airline not found'
            };
            res.end(JSON.stringify(msg));
        }else{

            var options = {

                host: airline.URL,
                path: restPath+req.params.flightId,
                method: 'POST'
            };
            var payload = JSON.stringify(req.body);
            var request = http.request(options, function(resp){

                resp.on('data', function(body){

                    res.end(body);
                });
            }).on('error', function(err){

                var msg = {
                    code: 502,
                    msg: err.message
                };
                res.end(JSON.stringify(msg));
            });
            request.write(payload);
            request.end();
        }
    });
});

router.get('/reservation/:airline/:reservationId', function(req,res){

    res.setHeader('Content-Type', 'application/json');
    Airlines.findOne({airline: req.params.airline}, function(err, airline){

        if(err){
            var msg = {
                code: 500,
                msg: err.message
            };
            res.end(JSON.stringify(msg));
        }else if(typeof airline == 'undefined'||airline==null){

            var msg = {
                code: 404,
                msg: 'Airline not found'
            };
            res.end(JSON.stringify(msg));
        }else{

            var options = {

                host: airline.URL,
                path: restPath+req.params.reservationId
            };
            console.log('res/:airline/:id GET: '+options.host+options.path);
            http.get(options, function(resp){

                resp.on('data', function(body){

                    res.end(body);
                });
            }).on('error', function(err){

                var msg = {
                    code: 502,
                    msg: err.message
                };
                res.end(JSON.stringify(msg))
            });
        }
    });
});

router.delete('/reservation/:airline/:reservationId', function(req,res){

    res.setHeader('Content-Type', 'application/json');
    Airlines.findOne({airline: req.params.airline}, function(err, airline){

        if(err){
            var msg = {
                code: 500,
                msg: err.message
            };
            res.end(JSON.stringify(msg));
        }else if(typeof airline == 'undefined'||airline==null){

            var msg = {
                code: 404,
                msg: 'Airline not found'
            };
            res.end(JSON.stringify(msg));
        }else{

            var options = {

                host: airline.URL,
                path: restPath+req.params.flightId,
                method: 'DELETE'
            };
            var request = http.request(options, function(resp){

                resp.on('data', function(body){

                    res.end(body);
                });
            }).on('error', function(err){

                var msg = {
                    code: 502,
                    msg: err.message
                };
                res.end(JSON.stringify(msg));
            });
            request.end();
        }
    });
});
module.exports = router;
