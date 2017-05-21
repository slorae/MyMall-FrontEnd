import template from './store.html';
import './store.scss';


class controller {
  constructor($scope, $state, $q, $mdSidenav, KindService, ToastService, 
    ClothService, AuthService) {
    'ngInject';
    this.$scope = $scope;
    this.$state = $state;
    this.$q = $q;
    this.$mdSidenav = $mdSidenav;
    this.KindService = KindService;
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

    this.date = (new Date()).valueOf();
    this.getKinds();
    this.getCloths();
  }

  // 用户浏览埋点
  $onDestroy() {
    const nowDate = (new Date()).valueOf();
    if ((nowDate - this.date) > (10 * 1000)) {
      if (this.kind_id !== 'all') {
        this.kinds.forEach(item => {
          if (item._id === this.kind_id) {
            this.AuthService.userTag(item.name);
          }
        });
      }
    }
  }

  // 获取所有分类 用于生成菜单
  getKinds() {
    this.KindService.getKinds()
      .then(kinds => {
        this.kinds = kinds;
      });
  }

  // 获取服装
  getCloths() {
    this.loadind = true;
    this.kind_id = this.$state.params.kind;
    this.date = (new Date()).valueOf();
    this.ClothService.getClothsByKindId(this.kind_id)
      .then(cloths => {
        this.loading = false;
        this.cloths = cloths;
      });
  }

  // 打开选择分类面板
  toggleRight() {
    this.$mdSidenav('right')
      .toggle();
  }

  // 选择分类
  chooseKind(kindId) {
    this.kind_id = kindId;
    this.$state.go('app.store', {
      kind: kindId,
    });
    this.$mdSidenav('right').close();
  }

  // 获取当前分类中文名
  getKindName() {
    if (!this.kinds) return '';
    if (this.kind_id === 'all') return '全部服装';
    let name = '';
    const nowKindId = this.kind_id;
    this.kinds.forEach(item => {
      if (item._id === nowKindId) {
        name = item.name;
      }
    });
    return name;
  }

  // 搜索结果
  querySearch(keyword) {
    if (!this.cloths) {
      this.cloths = [];
    }
    const result = this.cloths.filter(cloth => {
      if (cloth.name.indexOf(keyword) > -1) return true;
      if (cloth.brand.indexOf(keyword) > -1) return true;
      return false;
    });
    return this.$q.when(result);
  }

  // 告诉管理员
  tellAdmin(name) {
    // this.DaoVoiceService.openMessage(`好像少了这本书:  ${name}`);
  }

  // 选中服装
  selectedItemChange(item) {
    if (!item) return;
    this.queryCloths(item.name);
  }

  // 按照关键字搜索服装
  queryCloths(keyword) {
    this.loadind = true;
    this.ClothService.queryCloths(keyword)
      .then(cloths => {
        this.loadind = false;
        this.cloths = cloths;
      });
  }

  // 关键字变化
  keywordChange(keyword) {
    this.queryCloths(keyword);
  }
}

const storeComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default storeComponent;
