import orderDetailController from './order-detail/order-detail.controller';
import orderDetailTemplate from './order-detail/order-detail.template.html';
import payDialogController from './pay-dialog/pay-dialog.controller';
import payDialogTemplate from './pay-dialog/pay-dialog.template.html';

class OrderService {
  constructor($q, $http, AppConfig, $mdDialog) {
    'ngInject';
    this.$q = $q;
    this.$http = $http;
    this.AppConfig = AppConfig;
    this.$mdDialog = $mdDialog;
  }

  // 列出所有订单
  list() {
    return this.$http.get(`${this.AppConfig.APIURL}/orders`)
     .then(res => res.data);
  }

  // 根据 id 获取某个订单详情
  getOrder(orderId) {
    return this.$http.get(`${this.AppConfig.APIURL}/order/${orderId}`)
     .then(res => res.data);
  }

  // 创建一个订单
  create(order) {
    return this.$http.post(`${this.AppConfig.APIURL}/order`, order)
      .then(res => res.data);
  }

  // 删除一个订单
  delete(id) {
    return this.$http.delete(`${this.AppConfig.APIURL}/order/${id}`)
      .then(res => res.data);
  }

  // 更新一个订单
  update(order) {
    return this.$http.patch(`${this.AppConfig.APIURL}/order/${order._id}`, order)
     .then(res => res.data);
  }

  // 付款一个订单
  pay(orderId, password) {
    return this.$http.patch(`${this.AppConfig.APIURL}/order/${orderId}/pay`, {
      order_id: orderId,
      password,
    })
     .then(res => res.data);
  }

  // 管理员获取全部订单
  adminGetOrders(page, orderId) {
    let url = `${this.AppConfig.APIURL}/admin/orders?page=${page}&per_page=10`;
    if (orderId) url += `&id=${orderId}`;
    return this.$http.get(url)
     .then(res => res.data);
  }

  // 订单详情弹框
  orderDetail(order) {
    this.$mdDialog.show({
      controller: orderDetailController,
      controllerAs: 'vm',
      template: orderDetailTemplate,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      locals: {
        order,
      },
    });
  }

  // 付款窗口
  payDialog(order) {
    return this.$mdDialog.show({
      controller: payDialogController,
      controllerAs: 'vm',
      template: payDialogTemplate,
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      locals: {
        order,
      },
    });
  }
}

export default OrderService;
