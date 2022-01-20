import Vue from "vue";
import App from "./App.vue";
import VueGtag from "vue-gtag";
import "./registerServiceWorker";

Vue.use(VueGtag, {
  config: { id: "G-9GESM0G9FB" },
});

Vue.config.productionTip = false;

var app = new Vue({
  render: (h) => h(App),
});

console.log(Vue.config);
app.$mount("#app");
