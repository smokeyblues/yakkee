angular.module('Yakkee').factory('User', userFactory);

userFactory.$inject = ['$resource'];

function userFactory($resource) {
  return $resource('/api/users/:id', {
    id: '@_id'
  })
}
