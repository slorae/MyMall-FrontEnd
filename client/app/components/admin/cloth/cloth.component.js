import template from './cloth.html';
import './cloth.scss';

class controller {
  constructor($state, AuthService, ClothService, ToastService, CommonService, KindService) {
    'ngInject';

    this.$state = $state;
    this.AuthService = AuthService;
    this.ClothService = ClothService;
    this.ToastService = ToastService;
    this.CommonService = CommonService;
    this.KindService = KindService;
  }

  $onInit() {
    if (!this.AuthService.checkTypePass('admin', true)) return;
    this.getKinds();
    this.checkCloth();
    this.initUpload();
  }

   // 获取分类列表
  getKinds() {
    this.KindService.getKinds()
      .then(kinds => {
        let temp = [];
        kinds.forEach(kind => {
          temp.push(kind.name);
        });
        this.kinds = temp;
      }, () => {
        this.ToastService.toast('获取分类列表失败,请重新再试');
      });
  }

  // 初始化图片上传
  initUpload() {
    this.CommonService.uploadFrom('#cloth-cover-form', res => {
      this.cloth.cloth_cover = angular.fromJson(res).path;
    });
    // 触发提交时事件
    $('#cloth-cover-input').change(() => {
      $('#cloth-cover-submit').click();
    });
  }

  // 选中文件输入框
  choose() {
    $('#cloth-cover-input').click();
  }

  // 检查是否是新建服装
  checkCloth() {
    if (this.$state.params.cloth_id !== 'new') {
      this.ClothService.getCloth(this.$state.params.cloth_id)
        .then(cloth => {
          this.cloth = cloth;
        }, () => {
          this.ToastService.toast('获取服装详情失败');
        });
    } else {
      this.cloth = {};
    }
  }

  // 保存服装
  saveCloth() {
    // 新建
    if (!this.cloth._id) {
      this.ClothService.adminCreateCloth(this.cloth)
        .then(cloth => {
          this.ToastService.toast('新建服装成功');
          this.$state.go('app.admin.cloth', { cloth_id: cloth._id });
        }, () => {
          this.ToastService.toast('新建服装失败, 请重试');
        });
      return;
    }
    // 更新
    this.ClothService.adminUpdateCloth(this.cloth)
      .then(cloth => {
        this.ToastService.toast('更新服装成功');
        this.cloth = cloth;
        return;
      }, () => {
        this.ToastService.toast('更新服装失败, 请重试');
        return;
      });
  }
}

const clothComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default clothComponent;
