import Vue from 'vue';
import Index from './Index.vue';
import { VuePlugin } from 'vuera';

Vue.use(VuePlugin);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Index),
}).$mount('#app');
