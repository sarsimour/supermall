import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'
import FastClick from 'fastclick'

Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
  //preLoad: 1,
  //loading: require('assets/img/common/placeholder.png')
})

Vue.prototype.$bus = new Vue()

FastClick.attach(document.body)

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
