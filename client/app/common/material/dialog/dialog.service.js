import './dialog.scss';

class DialogService {
  constructor($q, $mdDialog) {
    'ngInject';

    this.$q = $q;
    this.$mdDialog = $mdDialog;
  }

  alert(config) {
    this.$mdDialog.show(
      this.$mdDialog.alert()
        .clickOutsideToClose(true)
        .title(config.title || '提示')
        .textContent(config.content || '正文')
        .ok(config.ok || '我知道了')
    );
  }

  confirm(config) {
    const confirm = this.$mdDialog.confirm()
         .title(config.title || '标题')
         .textContent(config.content || '正文')
         .ok(config.ok || '确认')
         .cancel(config.cancel || '取消');
    return this.$mdDialog.show(confirm);
  }

  prompt(config) {
    const confirm = this.$mdDialog.prompt()
      .title(config.title || '标题')
      .textContent(config.content || '正文')
      .placeholder(config.placeholder || '请输入')
      .initialValue(config.value || '请输入')
      .ok(config.ok || '确认')
      .cancel(config.cancel || '取消');
    return this.$mdDialog.show(confirm);
  }

}

export default DialogService;
