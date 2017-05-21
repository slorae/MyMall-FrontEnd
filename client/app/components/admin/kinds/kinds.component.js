import template from './kinds.html';
import './kinds.scss';

class controller {
  constructor($state, $mdDialog, AuthService, ToastService, CommonService,
    DialogService, KindService) {
    'ngInject';
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.AuthService = AuthService;
    this.ToastService = ToastService;
    this.CommonService = CommonService;
    this.DialogService = DialogService;
    this.KindService = KindService;
  }

  $onInit() {
    if (!this.AuthService.checkTypePass('admin', true)) return;
    this.getKinds();
  }

  // 获取分类列表
  getKinds() {
    this.KindService.getKinds()
      .then(kinds => {
        this.kinds = kinds;
      }, () => {
        this.ToastService.toast('获取分类列表失败,请重新再试');
      });
  }

  // 删除分类
  deleteKind(kind) {
    this.DialogService.confirm({
      title: '您确定要删除该分类？',
      content: '该操作不可逆',
      ok: '确认删除',
      cancel: '取消',
    })
    .then(() => {
      this.KindService.deleteKind(kind._id)
        .then(() => {
          this.getKinds();
          this.ToastService.toast('分类删除成功');
        }, () => {
          this.ToastService.toast('分类删除失败,请重新再试');
        });
    });
  }

  // 操作菜单
  openMenu($mdMenu, ev) {
    $mdMenu.open(ev);
  }

  // 修改分类
  renameKind(ev, kind) {
    let repeat = false;
    const prompt = this.$mdDialog.prompt()
      .title('更改分类名')
      .textContent('请输入分类名称')
      .placeholder('未分类')
      .initialValue(kind.name || '未分类')
      .targetEvent(ev)
      .ok('更换')
      .cancel('取消');
    this.$mdDialog.show(prompt)
      .then(result => {
        if (!result) {
          return this.ToastService.toast('不能是空名称');
        }
        this.kinds.forEach(item => {
          if (item.name === result) {
            repeat = true;
          }
        });
        if (repeat) return this.ToastService.toast('分类名不可重复,请重新再试');
        this.KindService.renameKind(kind._id, result)
          .then(() => {
            this.getKinds();
            this.ToastService.toast('评论提交成功');
          }, () => {
            this.ToastService.toast('评论提交失败, 请重试');
          });
      });
  }

  // 新增分类
  addkind() {
    let repeat = false;
    this.kinds.forEach(item => {
      if (item.name === this.kind.name) {
        repeat = true;
      }
    });
    if (repeat) {
      return this.ToastService.toast('分类名不可重复,请重新再试');
    } 
    this.KindService.addkind(this.kind.name)
      .then(() => {
        this.getKinds();
        this.editing = false;
        this.kind = undefined;
      }, () => {
        this.ToastService.toast('新增分类失败,请重新再试');
      });
  }
}

const kindsComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default kindsComponent;
