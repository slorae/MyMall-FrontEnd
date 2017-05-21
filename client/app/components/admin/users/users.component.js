import template from './users.html';
import './users.scss';

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
    this.getUsers(0);
  }

  // 获取用户
  getUsers(page) {
    this.loading = true;
    this.AuthService.getUsers(page, 'user')
      .then(data => {
        this.data = data;
        this.nums = this.CommonService.getPageNums(this.data.paginate.total_pages,
         this.data.paginate.page);
        this.loading = false;
      }, () => {
        this.loading = false;
        this.ToastService.toast('获取用户列表失败,请重新再试');
      });
  }

  // 更换页码
  changePage(num) {
    if (num === -1 || num === this.data.paginate.total_pages
    || num === this.data.paginate.page) return;
    this.getUsers(num);
  }

  // 删除用户
  deleteUser(user) {
    this.DialogService.confirm({
      title: '您确定要删除该用户？',
      content: '该操作不可逆',
      ok: '确认删除',
      cancel: '取消',
    })
    .then(() => {
      this.AuthService.deleteUser(user._id)
        .then(() => {
          this.getUsers(this.data.paginate.page);
        }, () => {
          this.ToastService.toast('用户删除失败,请重新再试');
        });
    });
  }
}

const usersComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default usersComponent;
