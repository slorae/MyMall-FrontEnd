class AddressService {
  constructor($q, $http, AppConfig) {
    'ngInject';
    this.$q = $q;
    this.$http = $http;
    this.AppConfig = AppConfig;
  }

  list(force = false) {
    if (!force && this.addresses) {
      return this.$q.when(this.addresses);
    }
    return this.$http.get(`${this.AppConfig.APIURL}/addresses`)
     .then(res => {
       this.addresses = res.data;
       return res.data;
     });
  }

  create(address) {
    return this.$http.post(`${this.AppConfig.APIURL}/address`, address)
     .then(res => {
       this.addresses = res.data;
       return res.data;
     });
  }

  update(address) {
    return this.$http.patch(`${this.AppConfig.APIURL}/address/${address._id}`, address)
     .then(res => {
       this.addresses = res.data;
       return res.data;
     });
  }

  delete(address) {
    return this.$http.delete(`${this.AppConfig.APIURL}/address/${address._id}`)
     .then(res => {
       this.addresses.filter(add => add._id !== address._id);
       return res.data;
     });
  }
}

export default AddressService;
