/* global angular */
(function () {
  angular.module('TwitApp', []);

  function mainController($http) {
    const vm = this;
    vm.submit = function () { // eslint-disable-line
      $http.post('/status/tweet', { status: vm.status })
        .then(function (res) { // eslint-disable-line
          vm.message = res.data.message;
        })
        .catch(function (err) { // eslint-disable-line
          vm.message = err.error;
        });
    };
  }
  mainController.$inject = ['$http'];

  angular
    .module('TwitApp')
    .component('myApp', {
      templateUrl: './app.html',
      controller: mainController,
      controllerAs: 'mainCtrl',
    });
}());
