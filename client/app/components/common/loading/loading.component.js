import template from './loading.html';
import './loading.scss';


class controller {
  constructor() {
    'ngInject';
  }

  $onInit() {
  }
}

const loadingComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default loadingComponent;
