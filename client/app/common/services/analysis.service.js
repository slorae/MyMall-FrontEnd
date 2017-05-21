import moment from 'moment';

class AnalysisService {
  constructor($http, $q, AppConfig, KindService) {
    'ngInject';
    this.$http = $http;
    this.AppConfig = AppConfig;
    this.KindService = KindService;
    this.$q = $q;
  }

  formatTime(str) {
    return moment(str).format('MM-DD');
  }

  getKindCover() {
    return this.$http.get(`${this.AppConfig.APIURL}/analysis/kind`)
     .then(res => res.data);
  }

  getOrderCover() {
    return this.$http.get(`${this.AppConfig.APIURL}/analysis/order_cover`)
     .then(res => res.data);
  }

  getUserRaise() {
    return this.$http.get(`${this.AppConfig.APIURL}/analysis/people`)
     .then(res => {
       let data = res.data;
       data.labels = data.labels.map(item => this.formatTime(item));
       return data;
     });
  }

  getIncomeRaise() {
    return this.$http.get(`${this.AppConfig.APIURL}/analysis/income`)
     .then(res => {
       let data = res.data;
       data.labels = data.labels.map(item => this.formatTime(item));
       return data;
     });
  }

  getOrderRaise() {
    return this.$http.get(`${this.AppConfig.APIURL}/analysis/order_raise`)
     .then(res => {
       let data = res.data;
       data.labels = data.labels.map(item => this.formatTime(item));
       return data;
     });
  }
}

export default AnalysisService;
