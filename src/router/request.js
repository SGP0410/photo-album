import store from '@/store'
import { getToken, getUserId } from '@/utils/auth'
import axios from 'axios'
import { Loading, Message } from 'element-ui'
import _ from 'lodash'
import Vue from 'vue'

let loadingInstance // loading 实例
let needLoadingRequestCount = 0 // 当前正在请求的数量

function showLoading() {
  const main = document.querySelector('#main-container')
  if (main) {
    if (needLoadingRequestCount === 0 && !loadingInstance) {
      loadingInstance = Loading.service({
        target: main, text: '正在加载...', background: 'rgba(0,0,0,0.3)'
      })
    }
    needLoadingRequestCount++
  }
}

function closeLoading() {
  Vue.nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
    needLoadingRequestCount--
    needLoadingRequestCount = Math.max(needLoadingRequestCount, 0) // 保证大于等于0
    if (needLoadingRequestCount === 0) {
      if (loadingInstance) {
        hideLoading()
      }
    }
  })
}

// 防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
// 因为有时会碰到在一次请求完毕后又立刻又发起一个新的请求的情况（比如删除一个表格一行后立刻进行刷新）
// 这种情况会造成连续 loading 两次，并且中间有一次极短的闪烁。通过防抖可以让 300ms 间隔内的 loading 便合并为一次，避免闪烁的情况。
var hideLoading = _.debounce(() => {
  loadingInstance.close()
  loadingInstance = null
}, 300)

// create an axios instance
const service = axios.create({
  // http://116.62.64.182:8901/
  baseURL: 'http://112.255.5.234:8801/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})
console.log(URL)
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
      config.headers['userId'] = getUserId()
    }
    console.log(config.isFormData)
    // if (config.isFormData) {
    //   // config.headers['Content-Type'] = 'multipart/form-data;'
    // } else {
    //   config.headers['Content-Type'] = 'application/json'
    // }
    // config.headers['Content-Type'] = 'application/json'
    if (!config.hideLoad) {
      showLoading()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    closeLoading()
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    closeLoading()
    if (response.config.hasStatus) {
      if (response.status !== 200) {
        return Promise.reject(new Error(response.msg || 'Error'))
      } else {
        return response
      }
    } else {
      const res = response.data
      if (res.status !== '200') {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 3 * 1000
        })
        if (res.status === '401') {
          // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
          //   console.log('delAllViews')
          // })
          store.dispatch('user/resetToken').then(() => {
            setTimeout(function() {
              location.reload()
            }, 5 * 1000)
          })
        }

        return Promise.reject(new Error(res.msg || 'Error'))
      } else {
        return res
      }
    }

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    closeLoading()
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
