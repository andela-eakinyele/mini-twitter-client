/* global angular */
(function () {
  angular.module('TwitApp', []);

  angular
    .module('TwitApp')
    .component('myApp', {
      templateUrl: './app.html',
      controller: mainController,
    });

  mainController.$inject = ['$http'];
  function mainController($http) {
    const vm = this;
    vm.submit = function () {
      $http.post('/status/tweet', { status: vm.status })
        .then(function (res) {
          vm.message = 'Success';
        })
        .catch(function (err) {
          console.log(err);
          vm.message = err.error;
        })
    };
  }
} ());