import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/custom.scss";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { BootstrapVue, BIconX } from "bootstrap-vue";
import "./plugins/vee-validate";
 
library.add(faUser);
library.add(faShoppingCart);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(BootstrapVue);
Vue.component('BIconX', BIconX);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app"); 