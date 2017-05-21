class CommonService {
  constructor($http, AppConfig) {
    'ngInject';
    this.$http = $http;
    this.AppConfig = AppConfig;
  }

  getPageNums(pages, page) {
    const nums = [];
    if (pages - page > 6) {
      nums.push(page);          
      nums.push(page + 1);
      nums.push(page + 2);
      nums.push(page + 3);
      nums.push(page + 4);
      nums.push(page + 5);        
    } else {
      for (let i = 0; i < (pages - page); i++) {
        nums.push(page + i);
      }
    }
    return nums;
  }

  uploadImg(data) {
    this.$http.post(`${this.AppConfig.APIURL}/upload`, data, {
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  }

  uploadFrom(ele, callback) {
    const APIURL = this.AppConfig.APIURL;
    $(ele).submit(function (event) {
      event.preventDefault();
      const form = $(this);
      // mulitipart form,如文件上传类
      const formData = new FormData(this);
      $.ajax({
        type: form.attr('method'),
        url: `${APIURL}/upload`,
        data: formData,
        mimeType: 'multipart/form-data',
        contentType: false,
        cache: false,
        processData: false,
        success: callback,
      });
    });
  }
}

export default CommonService;
