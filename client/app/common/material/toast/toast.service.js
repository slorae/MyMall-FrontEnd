class ToastService {
  constructor($q, $mdToast) {
    'ngInject';

    this.$q = $q;
    this.$mdToast = $mdToast;
  }

  toast(text) {
    const toast = this.$mdToast.simple()
     .textContent(text)
     .action('我知道了')
     .position('top right')
     .hideDelay(5000)
     .highlightAction(true)
     .toastClass('toast-dialog');
    return this.$mdToast.show(toast);
  }
}

export default ToastService;
