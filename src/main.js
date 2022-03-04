import Vue from 'vue'
import App from './App'
import router from './router'    //自动扫描里面的路由配置
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'


Vue.config.productionTip = false  //关闭生产模式下给出的提示
Vue.prototype.axios = axios;
Vue.use(ElementUI,VueAxios);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  //配置路由
  router,
  render: h => h(App)    //ElementUI
})
