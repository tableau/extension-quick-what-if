import Vue from 'vue';
import PopUp from './PopUp.vue';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(PopUp),
}).$mount('#app');
