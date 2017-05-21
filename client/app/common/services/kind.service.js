class KindService {
  constructor($q, $http, AppConfig) {
    'ngInject';
    this.$q = $q;
    this.$http = $http;
    this.AppConfig = AppConfig;
  }

  // 获取所有分类
  getKinds(force = false) {
    if (!force && this.kinds) {
      return this.$q.when(this.kinds);
    }
    return this.$http.get(`${this.AppConfig.APIURL}/kind`)
     .then(res => res.data);
  }

  // 新增分类
  addkind(name) {
    return this.$http.post(`${this.AppConfig.APIURL}/kind`, {
      name,
    })
     .then(res => {
       this.getKinds(true);
       return res.data;
     });
  }

  // 修改分类
  renameKind(kindId, name) {
    return this.$http.patch(`${this.AppConfig.APIURL}/kind/${kindId}`, {
      name,
    })
     .then(res => {
       this.getKinds(true);
       return res.data;
     });
  }

  // 删除分类
  deleteKind(kindId) {
    return this.$http.delete(`${this.AppConfig.APIURL}/kind/${kindId}`)
     .then(res => {
       this.getKinds(true);
       return res.data;
     });
  }
}

export default KindService;
