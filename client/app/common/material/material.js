import DialogService from './dialog/dialog.service';
import ToastService from './toast/toast.service';

const MaterialModule = angular.module('app.material', [])
  .service('DialogService', DialogService)
  .service('ToastService', ToastService);

export default MaterialModule;
