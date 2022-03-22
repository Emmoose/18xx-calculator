import Vue from "vue";
import App from "./App.vue";
import VueGtag from "vue-gtag";
import "./registerServiceWorker";
import store from "./store";

Vue.use(VueGtag, {
  config: { id: "G-9GESM0G9FB" },
});

Vue.config.productionTip = false;

var app = new Vue({
  store,
  render: (h) => h(App),
});

app.$mount("#app");
