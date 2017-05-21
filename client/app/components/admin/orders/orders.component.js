import template from './orders.html';
import './orders.scss';

class controller {
  constructor($scope, $state, AuthService, ToastService, CommonService,
    OrderService, DialogService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.AuthService = AuthService;
    this.ToastService = ToastService;
    this.CommonService = CommonService;
    this.OrderService = OrderService;
    this.DialogService = DialogService;
  }

  $onInit() {
    if (!this.AuthService.checkTypePass('admin', true)) return;
    this.getOrders(0);
    this.watchKeyword();
  }

  // 获取订单
  getOrders(page, id) {
    this.loading = true;
    this.OrderService.adminGetOrders(page, id)
      .then(data => {
        this.data = data;
        this.nums = this.CommonService.getPageNums(this.data.paginate.total_pages,
         this.data.paginate.page);
        this.loading = false;
      }, () => {
        this.loading = false;
        this.ToastService.toast('获取订单列表失败,请重新再试');
      });
  }

  // 更改分页
  changePage(num) {
    if (num === -1 || num === this.data.paginate.total_pages
    || num === this.data.paginate.page) return;
    this.getOrders(num);
  }

  // 操作菜单
  openMenu($mdMenu, ev) {
    $mdMenu.open(ev);
  }

  // 更改订单状态
  changeOrderState(order, state) {
    if (order.state === state) return;
    order.state = state;
    this.OrderService.update(order)
      .then(data => {
        order = data;
        this.ToastService.toast('更改订单状态成功');
      }, () => {
        this.ToastService.toast('更改订单状态失败, 请重试');
      });
  }

  // 删除订单
  deleteOrder(id) {
    this.DialogService.confirm({
      title: '您确定要删除该订单？',
      content: '该操作不可逆',
      ok: '确认删除',
      cancel: '取消',
    })
    .then(() => {
      this.OrderService.delete(id)
        .then(() => {
          this.getOrders(this.data.paginate.page);
        }, () => {
          this.ToastService.toast('删除订单失败, 请重试');
        });
    });
  }

  // 监控输入
  blur() {
    if (!this.order_id) return;
    this.getOrders(this.data.paginate.page, this.order_id);
  }

  watchKeyword() {
    this.$scope.$watch('vm.order_id', (newVal, oldVal) => {
      if (!newVal && !oldVal) return;
      if (newVal.length) {
        this.getOrders(this.data.paginate.page, this.order_id);
      }
      if (!newVal.length && oldVal.length) {
        this.getOrders(this.data.paginate.page, this.order_id);
      }
    });
  }

  // 订单详情
  orderDetail(order) {
    this.OrderService.orderDetail(order);
  }
}

const ordersComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default ordersComponent;
