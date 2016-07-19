'use strict';



var app = angular.module('myApp');




app.controller('mainCtrl', function($scope, $state, $auth, $rootScope) {
  // console.log('mainCtrl!');

  $scope.isAuthenticated = () => $auth.isAuthenticated();

  if ($scope.isAuthenticated()) {
    $rootScope.currUser = $auth.getPayload();
  }
  $scope.logout = () => {
    $auth.logout();
    $state.go('home');
  };

  // $scope.authenticate = provider => {
  //   $auth.authenticate(provider)
  //     .then(res => {
  //       $state.go('home');
  //     })
  //     .catch(err => {
  //       console.log('err:', err);
  //     });
  // };

});



app.controller('loginCtrl', function($scope, $state, $auth, $rootScope) {
  // console.log('loginCtrl!');

  $scope.login = () => {
    $auth.login($scope.user)
      .then(res => {
        console.log('res', res);
        // console.log($auth.getPayload());

        $state.go('home');
      })
      .catch(err => {
        console.log('err', err);
      })

  };

});



app.controller('registerCtrl', function($scope, $state, $auth) {
  // console.log('registerCtrl!');

  $scope.register = () => {
    if ($scope.user.password !== $scope.user.password2) {
      $scope.user.password = null;
      $scope.user.password2 = null;
      alert('Passwords do NOT match. Try again.')
    } else {

      $auth.signup($scope.user)
        .then(res => {
          console.log('res', res);
          $state.go('login');
        })
        .catch(err => {
          console.log('err', err);
        })
    }

  };

});