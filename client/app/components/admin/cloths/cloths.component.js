import template from './cloths.html';
import './cloths.scss';

class controller {
  constructor($state, AuthService, ToastService, CommonService, DialogService, ClothService) {
    'ngInject';
    this.$state = $state;
    this.AuthService = AuthService;
    this.ToastService = ToastService;
    this.CommonService = CommonService;
    this.DialogService = DialogService;
    this.ClothService = ClothService;
  }

  $onInit() {
    if (!this.AuthService.checkTypePass('admin', true)) return;
    this.adminGetCloths(0);
  }

  // 获取服装列表
  adminGetCloths(page) {
    this.loading = true;
    this.ClothService.adminGetCloths(page)
      .then(data => {
        this.data = data;
        this.nums = this.CommonService.getPageNums(this.data.paginate.total_pages,
         this.data.paginate.page);
        this.loading = false;
      }, () => {
        this.loading = false;
        this.ToastService.toast('获取服装列表失败,请重新再试');
      });
  }

  // 换页
  changePage(num) {
    if (num === -1 || num === this.data.paginate.total_pages
    || num === this.data.paginate.page) return;
    this.adminGetCloths(num);
  }

  // 删除服装
  deleteCloth(cloth) {
    this.DialogService.confirm({
      title: '您确定要删除该服装？',
      content: '该操作不可逆',
      ok: '确认删除',
      cancel: '取消',
    })
    .then(() => {
      this.ClothService.deleteCloth(cloth._id)
        .then(() => {
          this.adminGetCloths(this.data.paginate.page);
        }, () => {
          this.ToastService.toast('服装删除失败,请重新再试');
        });
    });
  }

  // 操作菜单
  openMenu($mdMenu, ev) {
    $mdMenu.open(ev);
  }

  // 服装详情
  clothDetail(cloth) {
    this.ClothService.moreDetail(cloth);
  }

  changeClothState(cloth, state) {
    if (cloth.state === state) return;
    this.ClothService.changeClothState(cloth._id, state)
      .then(() => {
        this.adminGetCloths(this.data.paginate.page);
      }, () => {
        this.ToastService.toast('状态更改失败, 请重试');
      });
  }
}

const clothsComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default clothsComponent;
