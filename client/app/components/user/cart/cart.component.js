import template from './cart.html';
import './cart.scss';


class controller {
  constructor($scope, $state, $mdDialog, DialogService, AuthService,
     AddressService, CartService, ToastService, OrderService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.DialogService = DialogService;
    this.ToastService = ToastService;
    this.AuthService = AuthService;
    this.AddressService = AddressService;
    this.CartService = CartService;
    this.OrderService = OrderService;
  }

  $onInit() {
    if (!this.AuthService.checkTypePass('user', true)) return;
    // 用户角色进入，正常请求数据
    this.getCartCloths();
    this.getAddresses();
  }

  // 获取购物车详情
  getCartCloths() {
    this.CartService.getCartCloths()
      .then(cloths => {
        this.cloths = cloths || [];
        this.allPrice = this.caclAllPrice(this.cloths);
      });
  }

  // 获取所有地址
  getAddresses() {
    this.AddressService.list()
     .then(addresses => {
       this.addresses = addresses;
       if (this.addresses.length > 0) {
         this.addresses[0].selected = true;
       }
     });
  }

  // 选择地址
  selectAddress(address) {
    if (address.selected) return;
    this.addresses = this.addresses.map(item => {
      if (item._id === address._id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return item;
    });
  }

  // 删除服装
  removeCloth(id) {
    this.DialogService.confirm({
      title: '您确定要删除该商品？',
      content: '删除后可通过主页重新搜索到该服装',
      ok: '确认删除',
      cancel: '取消',
    })
    .then(() => {
      this.CartService.deleteFromCart(id)
        .then(() => {
          this.cloths = this.cloths.filter(cloth => cloth._id !== id);
          this.allPrice = this.caclAllPrice(this.cloths);
          this.ToastService.toast('你已成功删除该商品');
        }, () => {
          this.ToastService.toast('删除失败, 请重试');
        });
    });
  }

  // 无法支付
  canNotPay() {
    let result = true;
    this.cloths.forEach(cloth => {
      if (cloth.selected) {
        this.addresses.forEach(address => {
          if (address.selected) {
            result = false;
          }
        });
      }
    });
    return result;
  }

  // 选中服装
  changeItem() {
    this.allPrice = this.caclAllPrice(this.cloths);
  }

  // 进入服装详情页
  goToCloth(cloth) {
    this.$state.go('app.recommend', {
      cloth_id: cloth.cloth_id,
    });
  }

  // 计算 总价
  caclAllPrice(cloths) {
    let allPrice = 0;
    cloths.forEach(cloth => {
      if (cloth.selected) {
        allPrice += cloth.price;
      }
    });
    return allPrice;
  }

  // 付款弹框
  creatOrder() {
    if (this.canNotPay()) return;
    this.paying = true;
    const target = {
      cloths: this.cloths.filter(cloth => cloth.selected),
      address: this.addresses.filter(address => address.selected)[0],
    };
    this.OrderService.create(target)
      .then(order => {
        // 打开付款窗口
        this.OrderService.payDialog(order)
          .then(() => {
            this.$state.go('app.user', {
              pageName: 'order',
            });
          }, () => {
            // 关闭窗口
            this.paying = false;
            this.getCartCloths();
          });
      });
  }
}

const recommendComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default recommendComponent;
