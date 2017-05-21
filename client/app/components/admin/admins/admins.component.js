import template from './admins.html';
import './admins.scss';

class controller {
  constructor($state, AuthService, ToastService, CommonService, DialogService) {
    'ngInject';
    this.$state = $state;
    this.AuthService = AuthService;
    this.ToastService = ToastService;
    this.CommonService = CommonService;
    this.DialogService = DialogService;
  }

  $onInit() {
    if (!this.AuthService.checkTypePass('admin', true)) return;
    this.getAdmins(0);
  }

  getAdmins(page) {
    this.loading = true;
    this.AuthService.getUsers(page, 'admin')
      .then(data => {
        this.data = data;
        this.nums = this.CommonService.getPageNums(this.data.paginate.total_pages,
         this.data.paginate.page);
        this.loading = false;
      }, () => {
        this.loading = false;
        this.ToastService.toast('获取管理员列表失败,请重新再试');
      });
  }

  changePage(num) {
    if (num === -1 || num === this.data.paginate.total_pages
    || num === this.data.paginate.page) return;
    this.getAdmins(num);
  }

  // 删除管理员
  deleteUser(user) {
    if (this.data.admins.length === 1) return;
    this.DialogService.confirm({
      title: '您确定要删除该管理员？',
      content: '该操作不可逆',
      ok: '确认删除',
      cancel: '取消',
    })
    .then(() => {
      this.AuthService.deleteUser(user._id)
        .then(() => {
          this.getAdmins(this.data.paginate.page);
        }, () => {
          this.ToastService.toast('用户删除失败,请重新再试');
        });
    });
  }

  // 双击编辑管理员
  editAdmin(user) {
    this.admin = angular.copy(user);
    this.editing = true;
  }

  // 保存管理员信息
  saveAdmin() {
    if (!this.canSave()) return;
    this.AuthService.saveAdmin(this.admin)
      .then(() => {
        this.getAdmins(this.data.paginate.page);
        if (this.admin._id) return this.ToastService.toast('更新管理员信息成功');
        this.addOrCancel();
        return this.ToastService.toast('新建管理员成功');
      }, () => {
        if (this.admin._id) return this.ToastService.toast('更新管理员信息失败, 请重试');
        return this.ToastService.toast('新建管理员失败, 请重试');
      });
  }

  // 取消或者新增按钮
  addOrCancel() {
    this.editing = !this.editing;
    if (!this.editing) {
      this.admin = undefined;
    }
  }

  // 验证是否可以保存
  canSave() {
    if (!this.admin) return false;
    if (!this.admin.account || !this.admin.name || !this.admin.password) return false;
    if (this.admin.account.length < 4 || this.admin.password.length < 6) return false;
    return true;
  }
}

const usersComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default usersComponent;
