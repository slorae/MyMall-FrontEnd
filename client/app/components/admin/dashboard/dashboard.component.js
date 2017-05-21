import template from './dashboard.html';
import './dashboard.scss';

class controller {
  constructor($state, ToastService, AuthService) {
    'ngInject';

    this.$state = $state;
    this.ToastService = ToastService;
    this.AuthService = AuthService;
  }

  $onInit() {
    if (!this.AuthService.checkTypePass('admin', true)) return;
  }
}

const dashboardComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default dashboardComponent;
