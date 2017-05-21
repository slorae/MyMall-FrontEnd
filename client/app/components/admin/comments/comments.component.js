import template from './comments.html';
import './comments.scss';

class controller {
  constructor($state, AuthService, ToastService, CommonService, 
    DialogService, ClothService, $mdDialog) {
    'ngInject';
    this.$state = $state;
    this.AuthService = AuthService;
    this.ToastService = ToastService;
    this.CommonService = CommonService;
    this.DialogService = DialogService;
    this.ClothService = ClothService;
    this.$mdDialog = $mdDialog;
  }

  $onInit() {
    if (!this.AuthService.checkTypePass('admin', true)) return;
    this.adminGetComments(0);
  }

  // 获取评论
  adminGetComments(page) {
    this.loading = true;
    this.ClothService.adminGetComments(this.$state.params.cloth_id, page)
      .then(data => {
        this.data = data;
        this.nums = this.CommonService.getPageNums(this.data.paginate.total_pages,
         this.data.paginate.page);
        this.loading = false;
      }, () => {
        this.loading = false;
        this.ToastService.toast('获取评论列表失败,请重新再试');
      });
  }

  // 更换页码
  changePage(num) {
    if (num === -1 || num === this.data.paginate.total_pages
    || num === this.data.paginate.page) return;
    this.adminGetComments(num);
  }

  // 删除评论
  deleteComment(comment) {
    this.DialogService.confirm({
      title: '您确定要删除该评论？',
      content: '该操作不可逆',
      ok: '确认删除',
      cancel: '取消',
    })
    .then(() => {
      this.AuthService.deleteComment(comment._id)
        .then(() => {
          this.adminGetComments(this.data.paginate.page);
        }, () => {
          this.ToastService.toast('评论删除失败,请重新再试');
        });
    });
  }

  // 打开菜单
  openMenu($mdMenu, ev) {
    $mdMenu.open(ev);
  }

  // 删除评论
  deleteComment(comment) {
    this.DialogService.confirm({
      title: '您确定要删除该评论？',
      content: '该操作不可逆',
      ok: '确认删除',
      cancel: '取消',
    })
    .then(() => {
      this.ClothService.deleteComment(comment._id)
        .then(() => {
          this.adminGetComments(this.data.paginate.page);
        }, () => {
          this.ToastService.toast('评论删除失败,请重新再试');
        });
    });
  }

  // 管理员回复评论
  replyComment(ev, comment) {
    if (!comment.reply) {
      comment.reply = {};
    }
    const prompt = this.$mdDialog.prompt()
      .title('管理员回复评论')
      .textContent('请输入评论内容')
      .placeholder('赞')
      .initialValue(comment.reply.comment_body || '赞')
      .targetEvent(ev)
      .ok('评论')
      .cancel('取消');
    this.$mdDialog.show(prompt)
      .then(result => {
        if (!result) {
          return this.ToastService.toast('不能是空评论');
        }
        this.ClothService.replyComment(comment._id, result)
          .then(res => {
            this.adminGetComments(this.data.paginate.page);
            this.ToastService.toast('评论提交成功');
          }, () => {
            this.ToastService.toast('评论提交失败, 请重试');
          });
      });
  }
}

const commentsComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default commentsComponent;
