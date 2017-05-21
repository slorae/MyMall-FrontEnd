// metaerial 的上层封装
import MaterialModule from './material/material';
// app 设置
import AppConfig from './config/app.config';
// http 拦截器
import AuthInterceptor from './config/auth.interceptor';

// services
import AuthService from './services/auth.service';
import AddressService from './services/address.service';
import OrderService from './services/order.service';
import CartService from './services/cart.service';
import ClothService from './services/cloth.service';
import CommonService from './services/common.service';
import KindService from './services/kind.service';
import AnalysisService from './services/analysis.service';



// filters
import { dateFilter, translateToCH } from './filters/filters';

const CommonModule = angular.module('common', [
  MaterialModule.name,
])
  .config(AuthInterceptor)
  .constant('AppConfig', AppConfig)

  .service('AuthService', AuthService)
  .service('AddressService', AddressService)
  .service('OrderService', OrderService)
  .service('CartService', CartService)
  .service('ClothService', ClothService)
  .service('CommonService', CommonService)
  .service('KindService', KindService)
  .service('AnalysisService', AnalysisService)

  .filter('dateFilter', dateFilter)
  .filter('translateToCH', translateToCH);



export default CommonModule;
