import template from './comment.html';
import './comment.scss';

class controller {
  constructor(ClothService, AuthService, ToastService) {
    'ngInject';
    this.ClothService = ClothService;
    this.AuthService = AuthService;
    this.ToastService = ToastService;
  }

  $onInit() {
    this.getComments();
  }

  // 获取评论列表
  getComments() {
    if (!this.cloth) return;
    this.ClothService.getComments(this.cloth._id)
      .then(comments => {
        this.comments = comments;
      }, () => {
        this.ToastService.toast('评论获取失败, 请重试');
      });
  }

  // 评论
  comment() {
    this.ClothService.comment(this.cloth._id, this.commentBody)
      .then(() => {
        this.getComments();
        this.commentBody = '';
      }, () => {
        this.ToastService.toast('评论失败, 请重试');
      });
  }
}

const commentComponent = {
  bindings: {
    cloth: '<',
  },
  template,
  controller,
  controllerAs: 'vm',
};

export default commentComponent;
