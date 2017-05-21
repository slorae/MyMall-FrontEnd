import template from './user-center.html';
import './user-center.scss';


class controller {
  constructor($state, $scope, AuthService,
    AddressService, OrderService, ToastService, $mdDialog, CommonService) {
    'ngInject';
    this.$state = $state;
    this.$scope = $scope;
    this.AuthService = AuthService;
    this.AddressService = AddressService;
    this.ToastService = ToastService;
    this.OrderService = OrderService;
    this.$mdDialog = $mdDialog;
    this.CommonService = CommonService;
  }

  $onInit() {
    if (!this.AuthService.checkTypePass('user', true)) return;
    this.getBasic();
    this.checkIndex();
    this.watchPageIndex();
    this.initUpload();
  }

  // 初始化头像上传
  initUpload() {
    this.CommonService.uploadFrom('#avatar-form', res => {
      this.user.avatar = angular.fromJson(res).path;
      this.AuthService.updateUser(this.user)
        .then(() => {
          this.ToastService.toast('头像上传成功');
          // this.$scope.$digest();
        }, () => {
          this.user.avatar = undefined;
          this.ToastService.toast('头像上传失败, 请重试');
        });
    });
    // 触发提交时事件
    $('#avatar-input').change(() => {
      $('#avatar-submit').click();
    });
  }

  // 选中文件输入框
  choose() {
    $('#avatar-input').click();
  }

  // 检查tab
  checkIndex() {
    if (this.$state.params.pageName === 'basic') {
      this.pageIndex = 0;
      this.getBasic();
      return;
    }

    if (this.$state.params.pageName === 'balance') {
      this.pageIndex = 1;
      this.getBasic();
      return;
    }

    if (this.$state.params.pageName === 'password') {
      this.pageIndex = 2;
      return;
    }

    if (this.$state.params.pageName === 'address') {
      this.pageIndex = 3;
      this.getAddresses();
      return;
    }

    if (this.$state.params.pageName === 'order') {
      this.pageIndex = 4;
      this.getOrders();
      return;
    }
    this.$state.go('app.user', { pageName: 'basic' });
  }

  // 获取基本信息
  getBasic() {
    this.user = this.AuthService.getCurrentUser();
  }

  // 监控tab切换
  watchPageIndex() {
    this.$scope.$watch('vm.pageIndex', (newVal, oldVal) => {
      if (newVal === oldVal) return;
      if (newVal === 0 || newVal === 1) this.getBasic();
      if (newVal === 3) this.getAddresses();
      if (newVal === 4) this.getOrders();
    });
  }

  // 基本信息
  saveBasic() {
    this.AuthService.updateUser(this.user)
      .then(user => {
        this.user = user;
        this.ToastService.toast('基本信息修改成功');
      }, () => {
        this.ToastService.toast('基本信息修改失败, 请重试');
      });
  }

  // 修改密码
  changePassword() {
    this.AuthService.changePassword(this.user._id, this.password)
      .then(() => {
        this.ToastService.toast('密码修改成功, 请重新登录');
        // 重新登陆
        this.AuthService.logOut(true);
      }, () => {
        this.ToastService.toast('原密码错误, 请重试');
      });
  }

  // 充值余额
  chargeBalance() {
    this.AuthService.chargeBalance(this.user._id, this.charge_number)
      .then(data => {
        this.user.balance = data.balance;
        this.ToastService.toast('充值成功');
      }, () => {
        this.ToastService.toast('充值失败, 请重新再试');
      });
  }

  // 退出登录
  logOut() {
    this.AuthService.logOut(true);
  }

  // 地址
  getAddresses() {
    this.loading = true;
    this.AddressService.list()
      .then(addresses => {
        this.loading = false;
        this.addresses = addresses;
      }, () => {
        this.addresses = [];
        this.loading = false;
        this.ToastService.toast('获取地址信息出错');
      });
  }

  // 保存地址
  saveAddress() {
    if (!this.address.contact_name || (this.address.contact_name
      && this.address.contact_name.length < 2)) {
      this.ToastService.toast('收件人格式错误');
      return;
    }
    if (!this.address.phone ||
      (this.address.phone && this.address.phone.length !== 11)) {
      this.ToastService.toast('电话格式错误');
      return;
    }
    if (!this.address.detail ||
      (this.address.detail && this.address.detail.length < 6)) {
      this.ToastService.toast('详细地址格式错误');
      return;
    }
    // 更新地址
    if (this.address._id) {
      this.AddressService.update(this.address)
        .then(() => {
          this.adding = false;
          this.AddressService.list()
            .then(addresses => {
              this.addresses = addresses;
            });
          this.ToastService.toast('地址更新成功');
        }, () => {
          this.ToastService.toast('地址更新失败, 请重试 ');
        });
    } else {
      // 新建地址
      this.AddressService.create(this.address)
      .then(() => {
        this.adding = false;
        this.AddressService.list()
        .then(addresses => {
          this.addresses = addresses;
        });
        this.ToastService.toast('地址新建成功');
      }, () => {
        this.ToastService.toast('地址保存失败, 请重试 ');
      });
    }
  }

  // 取消编辑地址
  cancelAddress() {
    this.adding = false;
    this.AddressService.list()
      .then(addresses => {
        this.addresses = addresses;
      });
    this.address = undefined;
  }

  // 单击更改为默认地址
  selectAddress(address) {
    if (address.is_default) return;
    // 更改默认地址
  }

  // 双击进行编辑
  editAddress(editaddress) {
    this.adding = true;
    this.address = editaddress;
  }

  // 订单
  getOrders() {
    this.OrderService.list()
      .then(orders => {
        // 未支付
        this.unpayOrders = orders.filter(order => order.state === 'unpay');
        // 未发货
        this.unsendOrders = orders.filter(order => order.state === 'unsend');
        // 未签收
        this.unassignOrders = orders.filter(order => order.state === 'unassign');
        // 已签收
        this.assignOrders = orders.filter(order => order.state === 'assign');
        // 已取消
        this.cancelOrders = orders.filter(order => order.state === 'cancel');
      }, () => {
        this.ToastService.toast('订单获取失败');
      });
  }

  // 订单详情
  orderDetail(order) {
    this.OrderService.orderDetail(order);
  }

  // 订单付款
  payOrder(order) {
    this.OrderService.payDialog(order)
    .then(() => {
      this.getOrders();
    }, () => {
    });
  }
  // 打开订单对话
  openNewMessage(orderNum) {
  }

  // 取消订饭
  cancelOrder(order) {
    order.state = 'cancel';
    this.OrderService.update(order)
      .then(() => {
        this.getOrders();
        this.ToastService.toast('取消订单成功');
      }, () => {
        this.ToastService.toast('取消订单失败, 请重试');
      });
  }
}

const userCenterComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default userCenterComponent;
