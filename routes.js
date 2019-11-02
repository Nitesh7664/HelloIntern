const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Job = require('./Models/Job');
const User = require('./Models/User');
const bcrypt = require('bcryptjs');


// HOME
router.get('/', (req, res) => {
    res.render('index', {
        loginId: req.cookies.loginId
    });
});

//LOGIN
router.get('/login', (req, res) => {
    res.render('login', {
        registered: false,
        data: false
    });
});
router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}).then(data => {
        if(data){
                bcrypt.compare(req.body.password, data.password).then(doMatch => {    
                    if(doMatch){
                        res.setHeader('Set-Cookie', 'loginId=' + data._id);
                        res.redirect('/content');
                    }else{
                        res.redirect('/login');
                    }
                }).catch(err => {
                    console.log(err);
                });
        }else{
            res.redirect('/register');
        }
    }).catch(err => {
        console.log(err);
    });
});


//REGISTER
router.get('/register', (req, res) => {
    if(req.cookies.loginId == 'false'){
        res.render('register', {
            loginId: req.cookies.loginId
        });
    }else{
        res.redirect('/content');
    }
});

router.post('/register', (req, res) => {
    User.findOne({email: req.body.email}).then(data =>{
        if(data){         
            res.render('login', {
                registered: true,
                data: data
            });
        }else{
            bcrypt.hash(req.body.password, 12).then(data => {
                //ENTER INTO THE DATABASE
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: data
                }).save().then(data => {
                    res.render('login', {
                        registered: false,
                        data: data
                    });
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                console.log(err);
            })
        }
    }).catch(err => {
        console.log(err);
    });
});




//ADD_JOB
router.get('/addjob', (req, res) => {
    res.render('addjob', {
        loginId: req.params.loginId
    });
});
router.post('/addjob', (req, res) => {
    date = new Date().toDateString();
    req.body.postedOn = date;
    const job = new Job(req.body).save().then(data => {
        User.findOne({_id: req.cookies.loginId}).then(userData => {
            userData.job = userData.job.push(data);
            User.findOneAndUpdate({email: userData.email}, {job: userData.job}).then(dataAfter =>{
                res.redirect('/content');
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => { 
        console.log(err);
    });
});


//CONTENT
router.get('/content', (req, res) => {
    Job.find({}).then(data => {
        res.render('content', {
            loginId: req.cookies.loginId,
            data: data
        });
    }).catch(err => {
        console.log(err);
    });
});

//CITIES
router.get('/content/:city', (req, res) => {
    if(req.cookies.loginId != 'false'){
        Job.find({location: req.params.city}).then(data => {
            res.render('content', {
                data: data,
                loginId: req.params.loginId
            });
        }).catch(err => {
            console.log(err);
        });
    }else{
        res.redirect('/login');
    };
});

//INTERNSHIP
router.get('/internship/:id', (req, res) => {
    if(req.cookies.loginId != 'false'){
        console.log(req.params.id);
        Job.findOne({_id: req.params.id}).then(data => {
            res.render('internship', {
                data: data,
                loginId: req.cookies.loginId
            });
        }).catch(err => {
            console.log(err);
        });
    }else{
        res.redirect('/login');
    };
});


//ABOUT
router.get('/about', (req, res) => {
    res.render('about', {
        loginId: req.cookies.loginId
    });
});


//LOGOUT
router.get('/logout', (req, res) => {
    res.setHeader('Set-Cookie','loginId=false');
    res.redirect('/');
});


module.exports = router;
