import Vue from "vue";
import App from "./App.vue";
import VueGtag from "vue-gtag";
import "./registerServiceWorker";
import store from "./store";
import vSelect from "vue-select";

Vue.component("v-select", vSelect);

Vue.use(VueGtag, {
  config: { id: "G-9GESM0G9FB" },
});

Vue.config.productionTip = false;

var app = new Vue({
  store,
  render: (h) => h(App),
});

app.$mount("#app");
