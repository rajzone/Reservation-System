var express = require('express');
var http = require('http');

var restArr = [];
var restPath = '/api/flights/';
restArr.push({

    airline: 'MMJ',
    URL:'http://airline-mich1104.rhcloud.com'
});

var router = express.Router();
router.get('/test', function(req, res) {
    res.header("Content-type","application/json");
    res.end('{"msg" : "Test Message fetched from the server, You are logged on as a User since you could fetch this data"}');
});

router.get('/flights/:airport/:date', function(req,res){

    var jsonArr = [];

    res.header("Content-type","application/json");
    restArr.forEach(function(element){

        var options = {

            host: element.URL,
            path: restPath+req.params.airport+'/'+req.params.date
        };
        console.log('ost'+options.host+options.path);
        http.get(options, function(resp){

            resp.on('data', function(data){

                console.log('data ost'+data,data);
                data.forEach(function(element){

                    jsonArr.push(element);
                });

            });
        }).on('error',function(err){

                //error handling?
            console.log('some error ost: '+err.message);
        });
    });
    //TODO: Dette virker ikke da det er asynchronized
    res.end(JSON.stringify(jsonArr));
});

router.get('/flights/:from/:to/:date', function(req,res){

    var jsonArr = [];

    res.header("Content-type","application/json");
    restArr.forEach(function(element){

        var options = {

            hostname: element.URL,
            path: restPath+req.params.from+'/'+req.params.to+'/'+req.params.date
        };
        http.get(options, function(resp){

            resp.on('data', function(data){

                data.forEach(function(element){

                    jsonArr.push(element);
                });
            });
        }).on('error',function(err){

            //error handling?
            console.log('some error ost: '+err.message);
        });
    });
    res.end(JSON.stringify(jsonArr));
});

router.post('/reservation/:airline/:flightId', function(req,res){

    var airline;
    restArr.forEach(function(element){

        if(element.airline===req.params.airline){
            airline = element;
        }
    });
    if(typeof airline === 'undefined'){
        res.end('airline not known');
    }else{

        var options = {

            hostname: airline.URL,
            path: restPath+req.params.flightId
        }
        http.post(options, function(resp){

            on('data', function(data){

                reservation = data;

                res.end(JSON.stringify(reservation));
            });

        }).on('error', function(err){

            //error handling?
            console.log('some error ost: '+err.message);

            res.end(JSON.stringify(err));
        });
        res.end(JSON.stringify());
    }
});

router.get('reservation/:airline/:reservationId', function(req,res){

    //
    res.header("Content-type","application/json");
    var airline;
    var reservation;
    restArr.forEach(function(element){

        if(element.airline===req.params.airline){
            airline = element;
        }
    });
    if(typeof airline === 'undefined'){
        res.end('airline not known');
    }else{

        var options = {

            hostname: airline.URL,
            path: restPath+req.params.reservationId
        }
        http.get(options, function(resp){

            on('data', function(data){

                reservation = data;

                res.end(JSON.stringify(reservation));
            });

        }).on('error', function(err){

            //error handling?
            console.log('some error ost: '+err.message);

            res.end(JSON.stringify(err));
        });
        res.end(JSON.stringify());
    }
});

router.delete('reservation/:airline/:reservationId', function(req,res){

    //
});

module.exports = router;
