'use strict';

var app = angular.module('myApp');

app.service('Business', function($http, $q) {
  this.search = (name, location) => {
    return $http.get(`api/businesses/search/${name}/${location}`)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        if (err) console.log(err);
      });

  };
  this.details = (yelpId) => {
    return $http.get(`api/businesses/details/${yelpId}`)
      .then(res => {
        console.log('details', res);
        return res.data;
      })
      .catch(err => {
        if (err) console.log(err);
      });
  };

  this.addFavorite = (yelpInfo) => {
    return $http.post('api/users/addFavorite', { yelpInfo })
      .catch(err => {
        if (err) console.log(err);
      });
  }
  this.removeFavorite = (yelpInfo) => {
    return $http.post('api/users/removeFavorite', { yelpInfo })
      .catch(err => {
        if (err) console.log(err);
      });
  }
});


app.service('User', function($http) {
  this.getFavorites = () => {

    return $http.get('api/users/favorites')
      .then(res => {
        console.log('details', res);
        return res.data.favorites;
      })
      .catch(err => {
        if (err) console.log(err);
      });

  }

})
