import template from './nav-header.html';
import './nav-header.scss';

class controller {
  constructor($scope, $state, AuthService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.AuthService = AuthService;
  }

  $onInit() {
    this.options = {
      direction: 'right',
      isOpen: false,
      mode: 'md-fling',
    };

    this.isLogin = this.AuthService.isLogin;

    if (this.isLogin) {
      this.user = this.AuthService.getCurrentUser();
    }

    this.watchLoginState();
  }

  // 监控登录状态
  watchLoginState() {
    this.$scope.$watch(() => this.AuthService.isLogin, (newVal) => {
      this.isLogin = newVal;
      if (this.isLogin) {
        this.user = this.AuthService.getCurrentUser();
      }
    });
  }

  // 跳转至登录页面
  goToLogin() {
    this.$state.go('app.login');
  }

  // 管理员退出登录
  adminLogout() {
    this.AuthService.logOut(true);
  }
}

const navHeaderComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default navHeaderComponent;
