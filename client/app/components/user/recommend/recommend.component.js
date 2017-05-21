import template from './recommend.html';
import './recommend.scss';


class controller {
  constructor($scope, $state, $mdDialog, CartService, ToastService, ClothService, AuthService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.CartService = CartService;
    this.ToastService = ToastService;
    this.ClothService = ClothService;
    this.AuthService = AuthService;
  }

  $onInit() {
    if (this.AuthService.user) {
      if (this.AuthService.user.type === 'admin') {
        this.$state.go('app.dashboard');
        return;
      }
    }
    this.loading = false;
    this.isDisabled = false;
    this.cloths = [];
    this.getRecommend();
  }

  // 获取推荐服装 
  getRecommend() {
    this.loading = true;
    if (this.$state.params.cloth_id && this.$state.params.cloth_id !== 'recommend') {
      this.ClothService.getCloth(this.$state.params.cloth_id)
        .then(cloth => {
          this.loading = false;
          this.cloth = cloth;
        }, () => {
          this.ToastService.toast('获取服装失败, 请重试');
        });
    } else {
      this.ClothService.getRecommend()
        .then(cloths => {
          this.loading = false;
          this.cloth = cloths[0];
        }, () => {
          this.ToastService.toast('获取推荐服装失败, 请重试');
        });
    }
  }

  // 点赞
  thumb(action) {
    if (action === 'up') {
      this.ClothService.thumbUp(this.cloth._id)
      .then(data => {
        this.cloth.thumb_up = data.thumb_up;
      }, () => {
        this.ToastService.toast('点赞失败, 请重试');
      });
    }
    if (action === 'down') {
      this.ClothService.thumbDown(this.cloth._id)
      .then(data => {
        this.cloth.thumb_down = data.thumb_down;
      }, () => {
        this.ToastService.toast('喝倒彩失败, 请重试');
      });
    }
  }

  // 加入到购物车
  addToCart() {
    if (this.adding) return;
    this.adding = true;
    this.CartService.addToCart(this.cloth._id)
      .then(() => {
        this.adding = false;
        this.ToastService.toast('已成功添加至购物车');
        this.$state.go('app.cart');
      }, () => {
        this.adding = false;
        this.ToastService.toast('添加到购物车失败, 请联系客服');
      });
  }

  // 查看服装详情
  moreDetail() {
    this.ClothService.moreDetail(this.cloth);
  }

}

const recommendComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default recommendComponent;
