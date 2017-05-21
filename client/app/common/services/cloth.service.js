import moreDetailTemplate from './more-detail/more-detail.template.html';
import moreDetailController from './more-detail/more-detail.controller';

class ClothService {
  constructor($q, $http, AppConfig, $mdDialog) {
    'ngInject';
    this.$q = $q;
    this.$http = $http;
    this.AppConfig = AppConfig;
    this.$mdDialog = $mdDialog;
  }

  // 获取今日推荐服装
  getRecommend() {
    return this.$http.get(`${this.AppConfig.APIURL}/cloth/today/recommend`)
     .then(res => res.data);
  }

  // 获取某个服装
  getCloth(clothId) {
    return this.$http.get(`${this.AppConfig.APIURL}/cloth/${clothId}`)
     .then(res => res.data);
  }

  // 按关键字获取服装列表
  queryCloths(keyword) {
    return this.$http.post(`${this.AppConfig.APIURL}/cloths/query`, {
      keyword,
    })
     .then(res => res.data);
  }

  // 获取服装列表
  getClothsByKindId(kindId) {
    return this.$http.get(`${this.AppConfig.APIURL}/cloths/${kindId}`)
     .then(res => res.data);
  }

  // 点赞
  thumbUp(clothId) {
    return this.$http.post(`${this.AppConfig.APIURL}/cloth/thumb_up/${clothId}`)
      .then(res => res.data);
  }

  // 倒彩
  thumbDown(clothId) {
    return this.$http.post(`${this.AppConfig.APIURL}/cloth/thumb_down/${clothId}`)
      .then(res => res.data);
  }

  // 会员评论
  comment(carId, body) {
    return this.$http.post(`${this.AppConfig.APIURL}/cloth/comments/new/${carId}`, {
      comment: body,
    })
      .then(res => res.data);
  }

  // 会员获取获取单个服装评论
  getComments(carId) {
    return this.$http.get(`${this.AppConfig.APIURL}/cloth/comments/all/${carId}`)
      .then(res => res.data);
  }

  // 管理员获取所有服装
  adminGetCloths(page) {
    return this.$http.get(`${this.AppConfig.APIURL}/admin/cloths?page=${page}&per_page=10`)
     .then(res => res.data);
  }

  // 管理员新增服装
  adminCreateCloth(cloth) {
    return this.$http.post(`${this.AppConfig.APIURL}/admin/cloth`, cloth)
     .then(res => res.data);
  }

  // 管理员更新服装
  adminUpdateCloth(cloth) {
    return this.$http.patch(`${this.AppConfig.APIURL}/admin/cloth/${cloth._id}`, cloth)
     .then(res => res.data);
  }

  // 管理员更新服装状态
  changeClothState(clothId, state) {
    return this.$http.patch(`${this.AppConfig.APIURL}/admin/cloth/changestate/${clothId}`, {
      state,
    })
     .then(res => res.data);
  }

  // 服装详情
  moreDetail(cloth) {
    this.$mdDialog.show({
      controller: moreDetailController,
      controllerAs: 'vm',
      template: moreDetailTemplate,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      locals: {
        cloth,
      },
    });
  }

  // 管理员获取单个汽车的评论
  adminGetComments(carId, page) {
    return this.$http.get(`${this.AppConfig.APIURL}/admin/comments/${carId}?page=${page}&per_page=10`)
      .then(res => res.data);
  }

  // 管理员删除某个评论
  deleteComment(commentId) {
    return this.$http.delete(`${this.AppConfig.APIURL}/cloth/comments/delete/${commentId}`)
      .then(res => res.data);
  }

  // 管理员回复某个评论
  replyComment(commentId, body) {
    return this.$http.post(`${this.AppConfig.APIURL}/cloth/comments/reply/${commentId}`, {
      body,
    })
     .then(res => res.data);
  }
}

export default ClothService;
