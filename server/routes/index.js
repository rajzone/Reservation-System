var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('mongoose').model('User');

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect("app/index.html")
});

router.post('/authenticate', function (req, res) {

    //finds a single user in the database and returns it
    User.findOne({username: req.body.username}, function (err, user) {

        if (user != null && req.body.username === user.username && req.body.password === user.password) {
            // We are sending the profile inside the token
            var token = jwt.sign(user, require("../security/secrets").secretTokenUser, {expiresInMinutes: 60 * 5});
            res.json({token: token});
        } else {
            //if user not found or invalid credentials, return 401
            res.status(401).send('Wrong user or password');
        }

    });

});

//Get Partials made as Views
router.get('/partials/:partialName', function (req, res) {
    var name = req.params.partialName;
    res.render('partials/' + name);
});

module.exports = router;
