const { default: axios } = require('axios');
window.Vue = require('vue');

let app = new Vue({
  el: '#app',
  data: {
    step: 1,
    toStep2ActiveButton: false,
    isShowModal: false,
    mainATSList: [],
    changedATSInfo: [],
    changedATSId: 0,
    url: {
      mainList: 'https://reqres.in/api/users?page=1',
      infoData: 'https://reqres.in/api/users?page=2',
    },
  },
  methods: {
    isStep() {
      if (this.step === 1 && this.toStep2ActiveButton === true) {
        this.step = 2;
      } else {
        this.isShowModal = false;
        this.step = 1;
      }
      this.setState();
    },
    isToggleModal() {
      this.isShowModal = !this.isShowModal;
    },
    changeATS(index) {
      if (this.changedATSId === this.mainATSList.data[index].id) {
        this.clearChangedATS();
      } else {
        this.toStep2ActiveButton = true;
        this.changedATSId = this.mainATSList.data[index].id;
        this.getATSInfo();
      }
      this.setState();
    },
    clearChangedATS() {
      this.toStep2ActiveButton = false;
      this.changedATSId = 0;
      this.setState();
    },
    getATSInfo() {
      axios.get(this.url.infoData)
        .then(response => this.changedATSInfo = response.data);
    },
    setState() {
      localStorage.step = this.step;
      localStorage.setItem('mainATSList', JSON.stringify(this.mainATSList));
      localStorage.changedATSId = this.changedATSId;
      localStorage.toStep2ActiveButton = this.toStep2ActiveButton;
      localStorage.setItem('changedATSInfo', JSON.stringify(this.changedATSInfo));
    },
  },
  created() {
  },
  mounted() {
    if (localStorage.getItem('mainATSList')) {
      this.mainATSList = JSON.parse(localStorage.getItem('mainATSList'));
    } else {
      axios.get(this.url.mainList).then(response => this.mainATSList = response.data);
    }
    this.isShowModal = false;
    if (localStorage.step) { this.step = Number(localStorage.step); }
    if (localStorage.changedATSId) { this.changedATSId = Number(localStorage.changedATSId); }
    if (localStorage.toStep2ActiveButton) {
      localStorage.toStep2ActiveButton === 'true'
        ? this.toStep2ActiveButton = true
        : this.toStep2ActiveButton = false;
    }
    if (localStorage.getItem('changedATSInfo')) {
      this.changedATSInfo = JSON.parse(localStorage.getItem('changedATSInfo'));
    }
  },
});
