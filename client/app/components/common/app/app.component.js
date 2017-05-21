import template from './app.html';
import './app.scss';

class controller {
  constructor($scope, $state, AuthService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.AuthService = AuthService;
  }

  $onInit() {
    if (this.$state.current.name === 'app') {
      this.$state.go('app.recommend');
    }
  }
}

const appComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default appComponent;
