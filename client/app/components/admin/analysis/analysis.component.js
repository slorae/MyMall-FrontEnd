import template from './analysis.html';
import './analysis.scss';

class controller {
  constructor($state, $q, AuthService, AnalysisService) {
    'ngInject';

    this.$state = $state;
    this.$q = $q;
    this.AnalysisService = AnalysisService;
    this.AuthService = AuthService;
  }

  $onInit() {
    if (!this.AuthService.checkTypePass('admin', true)) return;
    this.kind_cover = {
      labels: [],
      data: [],
    };
    this.order_cover = {
      labels: [],
      data: [],
    };
    this.people_raise = {
      labels: [],
      series: ['注册用户数'],
      data: [
        [],
      ],
      datasetOverride: [{ yAxisID: 'y-axis-1' }],
      options: {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left',
            },
          ],
        },
      },
    };
    this.income_raise = {
      labels: [],
      series: ['营业额'],
      data: [
        [],
      ],
      datasetOverride: [{ yAxisID: 'y-axis-1' }],
      options: {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left',
            },
          ],
        },
      },
    };
    this.order_raise = {
      labels: [],
      series: ['订单数'],
      data: [
        [],
      ],
      datasetOverride: [{ yAxisID: 'y-axis-1' }],
      options: {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left',
            },
          ],
        },
      },
    };
    this.getDatas();
  }

  getDatas() {
    this.loading = true;
    const q2 = this.AnalysisService.getOrderCover()
      .then(data => {
        this.order_cover = data;
      });
    const q3 = this.AnalysisService.getUserRaise()
      .then(data => {
        this.people_raise.labels = data.labels;
        this.people_raise.data[0] = data.data;
      });
    const q4 = this.AnalysisService.getIncomeRaise()
      .then(data => {
        this.income_raise.labels = data.labels;
        this.income_raise.data[0] = data.data;
      });
    const q5 = this.AnalysisService.getOrderRaise()
      .then(data => {
        this.order_raise.labels = data.labels;
        this.order_raise.data[0] = data.data;
      });
    this.$q.all([q2, q3, q4, q5])
      .then(() => {
        this.loading = false;
      });
  }

}

const analysisComponent = {
  template,
  controller,
  controllerAs: 'vm',
};

export default analysisComponent;
