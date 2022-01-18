import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";

Vue.config.productionTip = false;

var app = new Vue({
  render: (h) => h(App),
});

console.log(Vue.config);
app.$mount("#app");
