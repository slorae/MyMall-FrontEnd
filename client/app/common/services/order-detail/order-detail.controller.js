import './order-detail.scss';

class orderDetailController {
  constructor($mdDialog, order) {
    'ngInject';
    this.$mdDialog = $mdDialog;
    this.order = order;
  }

  hide() {
    this.$mdDialog.hide();
  }

  cancel() {
    this.$mdDialog.cancel();
  }

  help() {
  }
}
export default orderDetailController;
