var express = require('express');
var appRouter = express.Router();

module.exports = function(app, passport) {
    //normal Routes

    //index
    appRouter.route('/').get(function(request, response) {
    	response.render('index.ejs');
    });

    //profile if logged
    appRouter.route('/profile', isLoggedIn, function(request, response){
    	response.render('profile.ejs',{
    		user: request.user
    	});
    });

    //logout
    appRouter.route('/logout', function(request, response){
    	request.logout();
    	response.redirect('/');
    });

    //authenticate - first login

    //authorize - logged in, connecting other social account

    //unlink

    app.use(appRouter);
};

//middleware that will verify whether user is logged in
var isLoggedIn = function(request, response, next) {
    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect('/');
}
