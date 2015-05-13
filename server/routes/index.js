var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('mongoose').model('User');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var uuid = require('uuid');

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect("app/index.html")
});

/*==================Email Verification===================*/
router.get('/verify/:token', function (req, res) {

    //finds a single user in the database and updates it
    User.update({verified: req.params.token}, {
        verified: true
    }, function(err) {
        if (err) {
            res.json({code: 500, message: err});
        } else {
            res.json({code: 200, message: 'User verified'});
        }
    });

});

/*==================Authenticate User====================*/
router.post('/authenticate', function (req, res) {

    //finds a single user in the database and returns it
    User.findOne({username: req.body.username}, function (err, user) {

        if (user != null && req.body.username === user.username && bcrypt.compareSync(req.body.password, user.password)
            && user.verified === 'true') {
            // We are sending the profile inside the token
            var token = jwt.sign(user, require("../security/secrets").secretTokenUser, {expiresInMinutes: 60 * 5});
            res.json({token: token});
        } else {
            //if user not found or invalid credentials, return 401
            res.status(401).send('Wrong user or password');
        }

    });
});

/*=====================Register User=====================*/
router.post('/register', function (req, res) {

    //Password Hashing
    var hash = bcrypt.hashSync(req.body.password, 10);

    //Generates a unique token used for email verification
    var token = uuid.v4();

    //Information about new user
    var payload = {
        username: req.body.username,
        password: hash,
        email: req.body.email,
        role: req.body.role,
        verified: token,
        created: new Date()
    };

    //Creates new user
    var user = new User(payload);

    //Saves new user to database
    user.save(function (err) {
        if (err) {
            res.json({code: 500, message: err});
        } else {

            //Login credentials for Gmail
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'semesterprojekt1@gmail.com',
                    pass: 'P@ssw0rd20'
                }
            });

            //Setup e-mail data
            var mailOptions = {
                from: 'MJM Airlines <semesterprojekt1@gmail.com>',
                to: req.body.email,
                subject: 'Please Verify Your Account',
                html:  '<a href="http://localhost:3000/verify/' + token + '">Click here to verify your account</a>'
            };

            //Sends verification e-mail
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log('Verification sent to: ' + req.body.email);
                }
            });

            res.json({code: 200, message: 'User created'});
        }
    });

});

//Get Partials made as Views
router.get('/partials/:partialName', function (req, res) {
    var name = req.params.partialName;
    res.render('partials/' + name);
});

module.exports = router;
