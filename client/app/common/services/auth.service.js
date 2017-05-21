
class AuthService {
  constructor($rootScope, $q, $http, $state, AppConfig, ToastService) {
    'ngInject';
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$state = $state;
    this.$http = $http;
    this.AppConfig = AppConfig;
    this.ToastService = ToastService;
    this.isLogin = false;
    this.checked = false;
  }

  // 获取当前user信息
  getCurrentUser() {
    if (!this.checked) {
      this.checkAuth();
    }
    return this.user;
  }

  // 更新用户信息
  updateUser(user) {
    return this.$http.patch(`${this.AppConfig.APIURL}/user/${user._id}`, user)
     .then(res => {
       this.user = res.data;
       localStorage.setItem('user', angular.toJson(res.data));
       return this.user;
     });
  }

  // 用户修改密码
  changePassword(userId, password) {
    return this.$http.patch(`${this.AppConfig.APIURL}/user/${userId}/password`, password)
     .then(res => res.data);
  }

  // 用户充值余额
  chargeBalance(userId, charge_number) {
    return this.$http.patch(`${this.AppConfig.APIURL}/user/${userId}/charge`, {
      charge_number,
    })
     .then(res => res.data);
  }

  // 给用户打标签
  userTag(tag) {
    return this.$http.patch(`${this.AppConfig.APIURL}/user/tag/${this.user._id}`, {
      tag,
    })
     .then(res => res.data);
  }

  // 检查 token
  /* eslint-disable consistent-return*/
  checkAuth() {
    if (this.checked) return;
    this.checked = true;
    this.listenAjax();
    let auth = null;
    if (localStorage.getItem('auth')) {
      const temp = angular.fromJson(localStorage.getItem('auth'));
      if (angular.isObject(temp)) {
        auth = temp;
      } else {
        return this.logOut();
      }
    } else {
      return this.logOut();
    }
    // 判断时间戳是否过期，如果没有过期则暂时显示为登录，同时异步上后端验证一下
    if (auth.timestamp > new Date().getTime()) {
      this.isLogin = true;
      this.user = angular.fromJson(localStorage.getItem('user'));
      // 向后端验证一次身份
      this.$http.post(`${this.AppConfig.APIURL}/auth`, {
        auth: auth.auth,
      })
        .then(res => {
          // 更新本地 token 以及用户信息
          this.isLogin = true;
          this.checked = true;
          // 更新 user 信息
          this.user = res.data.user;
          localStorage.setItem('auth', angular.toJson(res.data.auth));
          localStorage.setItem('user', angular.toJson(res.data.user));
          return res.data;
        }, () => {
          // 验证 token 出错 处理方式相当于手动退出登录
          this.logOut();
        });
    } else {
      this.logOut();
    }
  }

  // 监听错误
  listenAjax() {
    this.$rootScope.$on('Unbrandized', () => {
      this.ToastService.toast('该操作需要您登录');
      this.logOut();
      this.$state.go('app.login');
    });
    this.$rootScope.$on('ServiceError', () => {
      this.ToastService.toast('服务器错误, 请联系管理员');
    });
  }

  // 登录
  login(info) {
    return this.$http.post(`${this.AppConfig.APIURL}/login`, {
      account: info.account,
      password: info.password,
    })
      .then(res => {
        this.user = res.data.user;
        this.isLogin = true;
        localStorage.setItem('auth', angular.toJson(res.data.auth));
        localStorage.setItem('user', angular.toJson(res.data.user));
        return res.data;
      });
  }

  // 注册
  register(info) {
    return this.$http.post(`${this.AppConfig.APIURL}/register`, {
      account: info.account,
      password: info.password,
    });
  }

  // 退出登录
  logOut(toLogin) {
    // 清空所有缓存的信息
    this.user = undefined;
    localStorage.clear();
    this.isLogin = false;
    // 变成访客模式
    if (toLogin) {
      this.$state.go('app.login');
    }
  }

  // 判断是否为管理员
  checkAdmin() {
    if (!this.checked) {
      this.checkAuth();
    }
    if (this.user) {
      if (this.user.type === 'admin') return true;
      return false;
    }
    return false;
  }

  // 进入组件的身份验证
  checkTypePass(type, needLogin = false) {
    if (!this.checked) {
      this.checkAuth();
    }
    if (!this.isLogin && needLogin) {
      this.$state.go('app.login');
      return;
    }
    if (this.user) {
      if (this.user.type === type) return true;
      if (type === 'admin') {
        this.$state.go('app.recommend');
      } else {
        this.$state.go('app.dashboard');
      }
      return false;
    }
    this.$state.go('app.recommend');
    return false;
  }

  // 管理员获取用户列表
  getUsers(page, type) {
    return this.$http.get(`${this.AppConfig.APIURL}/admin/users?page=${page}&per_page=10&type=${type}`)
      .then(res => res.data);
  }

  // 管理员删除用户
  deleteUser(id) {
    return this.$http.delete(`${this.AppConfig.APIURL}/admin/user/${id}`)
      .then(res => res.data);
  }

  // 保存或更新管理员
  saveAdmin(user) {
    if (user._id) return this.updateUser(user);
    return this.$http.post(`${this.AppConfig.APIURL}/admin/user`, user)
      .then(res => res.data);
  }

}

export default AuthService;
