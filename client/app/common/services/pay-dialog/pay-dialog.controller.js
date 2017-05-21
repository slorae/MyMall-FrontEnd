class moreDetailController {
  constructor($mdDialog, $state, order, AuthService, OrderService, ToastService) {
    'ngInject';
    this.$mdDialog = $mdDialog;
    this.$state = $state;
    this.AuthService = AuthService;
    this.OrderService = OrderService;
    this.ToastService = ToastService;
    this.order = order;
    this.active();
  }

  active() {
    this.user = this.AuthService.getCurrentUser();
  }

  hide() {
    this.$mdDialog.hide();
  }

  cancel() {
    this.$mdDialog.cancel();
  }

  pay() {
    this.loading = true;
    this.OrderService.pay(this.order._id, this.password)
      .then(() => {
        this.ToastService.toast('付款成功');
        this.$mdDialog.hide();
        this.$state.go('app.user', {
          pageName: 'order',
        });
      }, () => {
        this.loading = false;
        this.password = '';
        this.ToastService.toast('密码错误, 请重试');
      });
  }

  charge() {
    this.$state.go('app.user', {
      pageName: 'balance',
    });
    this.$mdDialog.hide();
  }
}
export default moreDetailController;
