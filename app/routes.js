var express = require('express');
var appRouter = express.Router();
var authRouter = express.Router();
var connectRouter = express.Router();

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
        response.render('login.ejs');
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

    //twitter
    authRouter.get('/twitter', passport.authenticate('twitter', { scope: 'email' }));

    authRouter.get('/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    //google
    authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    authRouter.get('/google/callback', passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));




    //authorize - logged in, connecting other social account

    //local
    connectRouter.get('/local', function(request, response) {
        res.render('connect-local.ejs');
    });
    connectRouter.post('/local', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    //Facebook
    connectRouter.get('/facebook', passport.authorize('facebook', { scope: 'email' }));

    connectRouter.get('/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    //Twitter
    connectRouter.get('/twitter', passport.authorize('twitter', { scope: 'email' }));

    // handle the callback after twitter has authorized the user
    connectRouter.get('/twitter/callback',
        passport.authorize('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    //Google
    connectRouter.get('/google', passport.authorize('google', { scope: ['profile', 'email'] }));

    // the callback after google has authorized the user
    connectRouter.get('/google/callback',
        passport.authorize('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    //unlink

    app.use('/', appRouter);
    app.use('/auth', authRouter);
    app.use('/connect', connectRouter);
};

//middleware that will verify whether user is logged in
var isLoggedIn = function(request, response, next) {
    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect('/');
}
