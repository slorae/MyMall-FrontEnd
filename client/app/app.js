// UI Router
import uiRouter from 'angular-ui-router';

// 公用模块 service filter config 等
import CommonModule from './common/common';
// 组件 component
import ComponentsModule from './components/components';

const app = angular.module('app', [
  CommonModule.name,
  ComponentsModule.name,
  uiRouter,
  'ngMaterial',
  'simditor',
  'chart.js',
]);

app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    url: '/',
    template: '<app></app>',
    resolve: {
      /* eslint-disable arrow-body-style*/
      auth: (AuthService) => {
        // 根路由，进行身份验证，所有的从url直接访问的路由都会执行这一步操作
        return AuthService.checkAuth();
      },
    },
    redirectTo: 'app.recommend',
  })
  // 登录
  .state('app.login', {
    url: 'login',
    views: {
      'content@app': {
        template: '<login></login>',
      },
    },
  })
  /* -------------------------用户视图--------------------------- */
  .state('app.recommend', {
    url: 'recommend?cloth_id',
    views: {
      'content@app': {
        template: '<recommend></recommend>',
      },
    },
  })
  .state('app.store', {
    url: 'store/:kind',
    views: {
      'content@app': {
        template: '<store></store>',
      },
    },
  })
  // 个人中心
  .state('app.user', {
    url: 'user/:pageName',
    views: {
      'content@app': {
        template: '<user-center><user-center>',
      },
    },
  })
  //  购物车
  .state('app.cart', {
    url: 'cart',
    views: {
      'content@app': {
        template: '<cart></cart>',
      },
    },
  })
  /* -------------------------管理员视图--------------------------- */
  .state('app.dashboard', {
    url: 'dashboard',
    views: {
      'content@app': {
        template: '<dashboard></dashboard>',
      },
    },
  })
  .state('app.admin', {
    url: 'admin',
    views: {
      'content@app': {
        template: '',
      },
    },
  })
  .state('app.admin.users', {
    url: '/users',
    views: {
      'content@app': {
        template: '<users></users>',
      },
    },
  })
  .state('app.admin.admins', {
    url: '/admins',
    views: {
      'content@app': {
        template: '<admins></admins>',
      },
    },
  })
  .state('app.admin.orders', {
    url: '/orders',
    views: {
      'content@app': {
        template: '<orders></orders>',
      },
    },
  })
  .state('app.admin.cloths', {
    url: '/cloths',
    views: {
      'content@app': {
        template: '<cloths></cloths>',
      },
    },
  })
  .state('app.admin.comments', {
    url: '/comments/:cloth_id',
    views: {
      'content@app': {
        template: '<comments></comments>',
      },
    },
  })
  .state('app.admin.cloth', {
    url: '/cloth/:cloth_id',
    views: {
      'content@app': {
        template: '<cloth></cloth>',
      },
    },
  })
  .state('app.admin.kinds', {
    url: '/kinds',
    views: {
      'content@app': {
        template: '<kinds></kinds>',
      },
    },
  })
  .state('app.admin.analysis', {
    url: '/analysis',
    views: {
      'content@app': {
        template: '<analysis></analysis>',
      },
    },
  });
  $urlRouterProvider.otherwise('/');
}]);
