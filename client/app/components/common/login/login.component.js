import template from './login.html';
import './login.scss';

class controller {
  constructor($interval, $state, AuthService, ToastService) {
    'ngInject';
    this.$state = $state;
    this.$interval = $interval;
    this.AuthService = AuthService;
    this.ToastService = ToastService;
  }

  $onInit() {
    if (this.AuthService.isLogin) {
      this.$state.go('app.recommend');
      return;
    }
    this.nowLogin = true;
  }

  changeModel() {
    this.nowLogin = !this.nowLogin;
  }

  canNotSave() {
    if (!this.user) {
      return true;
    }
    if (!this.user.account || !this.user.password) {
      return true;
    }
    if (this.user.account.length < 4 || this.user.password.length < 4) {
      return true;
    }
    return false;
  }

  login() {
    if (this.canNotSave()) return;
    this.AuthService.login(this.user)
      .then(() => {
        // 登录成功
        this.$state.go('app.recommend', { replace: true });
      }, () => {
        this.ToastService.toast('账号或密码错误');
      });
  }

  register() {
    if (this.canNotSave()) return;
    this.AuthService.register(this.user)
      .then(() => {
        this.nowLogin = true;
        // this.ToastService.toast('注册成功, 请登录');
        this.user = angular.copy(this.user);
        this.login();
      }, res => {
        this.user = {};
        if (res.data.code === 'account_repeat') {
          this.ToastService.toast('该账号已被注册, 更换账号名');
          return;
        }
        this.ToastService.toast('账号或密码错误');
      });
  }
}

const loginComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default loginComponent;
