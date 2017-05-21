// 对所有 http 请求进行一层拦截
function getAuth() {
  if (localStorage.getItem('auth')) {
    const auth = angular.fromJson(localStorage.getItem('auth'));
    if (angular.isObject(auth)) {
      return auth.auth;
    }
    return null;
  }
  return null;
}

function InterceptorHttp($q, $rootScope) {
  'ngInject';
  return {
    request(config) {
      /* eslint-disable no-param-reassign*/
      if (getAuth()) {
        config.headers.authorization = getAuth();
      }
      return config;
    },

    responseError(response) {
      if (response.status === 400 || response.status === 401) {
        $rootScope.$broadcast('Unbrandized', response);
      }
      if (response.status === 403) {
        $rootScope.$broadcast('Forbidden', response);
      }
      if (response.status === 500) {
        $rootScope.$broadcast('ServiceError', response);
      }
      return $q.reject(response);
    },
  };
}

function AuthInterceptor($httpProvider) {
  'ngInject';
  $httpProvider.interceptors.push(InterceptorHttp);
}

export default AuthInterceptor;
