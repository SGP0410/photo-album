import axios from 'axios'

const request = axios.create({
  baseURL : "",         //统一网关入口
  timeout : 10000        //超时时间
})


