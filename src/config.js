import Vue from 'vue';
import Config from './Config.vue';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Config),
}).$mount('#app');
