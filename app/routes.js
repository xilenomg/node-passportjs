var express = require('express');
var appRouter = express.Router();
var authRouter = express.Router();

module.exports = function(app, passport) {
    //normal Routes

    //index
    appRouter.route('/').get(function(request, response) {
        response.render('index.ejs');
    });

    //profile if logged
    appRouter.route('/profile', isLoggedIn, function(request, response) {
        response.render('profile.ejs', {
            user: request.user
        });
    });

    //logout
    appRouter.route('/logout', function(request, response) {
        request.logout();
        response.redirect('/');
    });

    //authenticate - first login

    //local
    //login form
    appRouter.get('/login', function(request, response) {
        res.render('login.ejs');
    });
    //process login form
    appRouter.post('/login', passport.authenticate('local-login', {
        // redirect to the secure profile section
        successRedirect: '/profile',
        // redirect back to the signup page if there is an error
        failureRedirect: '/login',
        // allow flash messages
        failureFlash: true
    }));
    appRouter.get('/signup', function(request, response) {
        res.render('signup.ejs');
    });
    appRouter.post('/signup', passport.authenticate('local-signup', {
        // redirect to the secure profile section
        successRedirect: '/profile',
        // redirect back to the signup page if there is an error
        failureRedirect: '/signup',
        // allow flash messages
        failureFlash: 'true'
    }))

    //facebook
    //scopes: https://developers.facebook.com/docs/facebook-login/permissions
    authRouter.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

    authRouter.get('/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));




    //authorize - logged in, connecting other social account

    //unlink

    app.use('/', appRouter);
    app.use('/auth', authRouter);
};

//middleware that will verify whether user is logged in
var isLoggedIn = function(request, response, next) {
    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect('/');
}
