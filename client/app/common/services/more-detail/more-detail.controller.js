import './more-detail.scss';

class moreDetailController {
  constructor($mdDialog, $sce, AuthService, cloth) {
    'ngInject';
    this.$mdDialog = $mdDialog;
    this.cloth = cloth;
    this.$sce = $sce;
    this.AuthService = AuthService;
    this.active();
  }

  active() {
    this.description = this.$sce.trustAsHtml(this.cloth.description);
    this.isAdmin = this.AuthService.checkAdmin();
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
export default moreDetailController;
