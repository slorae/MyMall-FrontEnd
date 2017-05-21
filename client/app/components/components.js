// 共同组件
import app from './common/app/app.component';
import login from './common/login/login.component';
import navHeader from './common/nav-header/nav-header.component';
import loading from './common/loading/loading.component';
import comment from './common/comment/comment.component';

// 用户组件
import userCenter from './user/user-center/user-center.component';
import recommend from './user/recommend/recommend.component';
import store from './user/store/store.component';
import cart from './user/cart/cart.component';
// 管理员组件
import dashboard from './admin/dashboard/dashboard.component';
import analysis from './admin/analysis/analysis.component';
import users from './admin/users/users.component';
import admins from './admin/admins/admins.component';
import orders from './admin/orders/orders.component';
import cloths from './admin/cloths/cloths.component';
import cloth from './admin/cloth/cloth.component';
import comments from './admin/comments/comments.component';
import kinds from './admin/kinds/kinds.component';

const Module = angular.module('app.components', [])
  // ------------------- 公共视图 -------------------
  // 视图容器
  .component('app', app)
  // 头部导航条
  .component('navHeader', navHeader)
  // 注册登录
  .component('login', login)
  // 等候动画
  .component('loading', loading)
  // 评论
  .component('comment', comment)

  // ------------------- 会员视图 -------------------
  // 个人中心
  .component('userCenter', userCenter)
  // 列表页
  .component('store', store)
  // 推荐
  .component('recommend', recommend)
  // 购物车
  .component('cart', cart)

  // ------------------- 管理员视图 -----------------
  // 主面板
  .component('dashboard', dashboard)
  // 用户管理
  .component('users', users)
  // 管理员管理
  .component('admins', admins)
  // 订单管理
  .component('orders', orders)
  // 服装列表
  .component('cloths', cloths)
  // 单个服装(新增 或者 编辑)
  .component('cloth', cloth)
  // 单个服装评论
  .component('comments', comments)
  // 分类
  .component('kinds', kinds)
  // 数据分析
  .component('analysis', analysis);

export default Module;
