'use strict';



var app = angular.module('myApp');


app.controller('favoritesCtrl', function($scope, Favorites) {
  $scope.favorites = Favorites;
})


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

app.controller('homeCtrl', function($scope, $state, Business) {
  $scope.loading=false;
  $scope.businessSearch = () => {
        $scope.loading = true;
        $state.go('search', {name: $scope.businessName, location: $scope.businessLocation});
  };
});


app.controller('searchCtrl', function($scope, $state, $stateParams, Businesses) {
  console.log(Businesses);
  $scope.businesses = Businesses.businesses;

});


app.controller('detailsCtrl', function($scope, $state, $stateParams, Details, Business,$rootScope, $auth) {
  $scope.authenticated = false;
  if($auth.isAuthenticated()) {
    $scope.authenticated = true;
  }
  console.log('details ctrl');
  console.log(Details);
  $scope.details = Details;

  if($scope.details.favoriteCount && $auth.isAuthenticated()) {
    $rootScope.currUser = $auth.getPayload();
    $scope.authenticated = true;
    console.log('curr user',$rootScope);
    $scope.favorite = $scope.details.users.includes($rootScope.currUser._id);
  }
  let favorite = $scope.favorite;
  $scope.toggleFavorite = (toggle) => {
    
    if(toggle) {
      Business.addFavorite($scope.details.yelpInfo)
        .then(res => {
          console.log(res.data);
          $scope.details.favoriteCount = res.data.favoriteCount;
        });
    } else {
      Business.removeFavorite($scope.details.yelpInfo)
        .then(res => {
          console.log(res.data);
          $scope.details.favoriteCount = res.data.favoriteCount;
        })
    }
  };



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