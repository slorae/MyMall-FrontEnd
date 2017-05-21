class CartService {
  constructor($q, $http, AppConfig) {
    'ngInject';
    this.$q = $q;
    this.$http = $http;
    this.AppConfig = AppConfig;
  }

  // 获取购物车详情
  getCartCloths() {
    return this.$http.get(`${this.AppConfig.APIURL}/cart`)
     .then(res => res.data.cloths);
  }

  // 往购物车里添加商品
  addToCart(clothId) {
    return this.$http.post(`${this.AppConfig.APIURL}/cart/add/${clothId}`)
     .then(res => res.data.cloths);
  }

  // 从购物车里删除商品
  deleteFromCart(id) {
    return this.$http.delete(`${this.AppConfig.APIURL}/cart/delete/${id}`)
     .then(res => res.data.cloths);
  }
}

export default CartService;
