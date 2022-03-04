import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login'
import Main from '../views/Main'
import NotFound from '../views/NotFound'

//安装路由
Vue.use(Router)

//配置导出路由
export default new Router({
  mode: "history",
  routes: [
    {
      //路由路径
      path: '/login',
      name: 'login',
      //跳转的组件
      component: Login
    },
    {
      //路由路径
      path: '/',
      name: 'main',
      //跳转的组件
      component: Main
    },
    {
      path: '*',
      name: 'notfound',
      component: NotFound
    }
  ]
})
