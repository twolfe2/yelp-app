'use strict';


var app = angular.module('myApp', ['ui.router', 'ui.router', 'satellizer', 'ui.bootstrap']);

app.config(function($authProvider) {
  $authProvider.loginUrl = '/api/users/login';
  $authProvider.signupUrl = '/api/users/signup';

  $authProvider.facebook({
    clientId: '277768235911300',
    url: '/api/users/facebook'
  });

});

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/html/home.html',
      controller: 'homeCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: '/html/register.html',
      controller: 'registerCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: '/html/login.html',
      controller: 'loginCtrl'
    })
    .state('search', {
      url: '/search/:name/:location', 
      templateUrl: '/html/search.html',
      controller: 'searchCtrl',
      resolve: {
        Businesses: function(Business, $stateParams) {
          return Business.search($stateParams.name);
        }
      }
    })
    .state('details' , {
      url: '/:yelpId',
      templateUrl: '/html/details.html',
      controller: 'detailsCtrl',
      resolve: {
        Details: function(Business, $stateParams) {
          return Business.details($stateParams.yelpId);
        }

      }
    })

  $urlRouterProvider.otherwise('/');
})