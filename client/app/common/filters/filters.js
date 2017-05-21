import moment from 'moment';
import TranslateWords from './translate';
// 格式化时间
export const dateFilter = () => {
  'ngInject';
  return function (str) {
    if (!str) return '-';
    return moment(str).format('YYYY-MM-DD HH:mm');
  };
};

// 翻译
export const translateToCH = () => {
  'ngInject';
  return function (key) {
    return TranslateWords[key] || '-';
  };
};
