
import axios from 'axios'
import qs from 'qs'
import { Modal } from 'iview'
// axios 配置
axios.defaults.timeout = 20000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.common['token'] = sessionStorage.getItem('token')
// const apiUrl = 'https://api.littleasy.com:10006/backstage/'// 正式API
const host = '114.55.98.42:10005'
const apiUrl = 'http://114.55.98.42:10005/teashop_backstage/'// 正式API
// const apiUrl = 'http://47.110.124.62:10005/teashop_backstage/'// 正式API

// POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = JSON.stringify(config.data)
  }
  return config
}, (error) => {
  console.log(error)
  return Promise.reject(error)
})

export function postFetch (url, params) {
  return new Promise((resolve) => {
    axios.post(url, params)
      .then(response => {
        if (response.data.status === 40069 || response.data.status == 40068 || response.data.status == 40067) { // 设备在其他地方登录
          sessionStorage.removeItem('token')
          window.location.href = '#/login'
          /* Modal.error({
            title: '' + response.data.result + '',
            onOk: () => {
              window.location.href = '#/login'
            }
          }) */
        }
        resolve(response.data)
      }, () => {
      })
      .catch(() => {

      })
  })
}
export function postLogin (url, params) {
  return new Promise((resolve) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        console.log(err)
      })
      .catch((error) => {
        console.log(error)
      })
  })
}
export function getLogin (url, params) {
  return new Promise((resolve) => {
    if (params == null) { params = {} }
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        console.log(err)
      })
      .catch((error) => {
        console.log(error)
      })
  })
}
// get请求方式
export function getFetch (url, params) {
  return new Promise((resolve) => {
    axios.get(url, {
      params: params
    }, {
      headers: {
        'token': sessionStorage.getItem('Token')
      }
    })
      .then(response => {
        if (response.data.status == 40017 || response.data.status == 40069 || response.data.status == 40068) { // 设备在其他地方登录
          sessionStorage.removeItem('token')
          window.location.href = '#/login'
        }
        resolve(response.data)
      }, err => {
        console.log(err)
      })
      .catch((error) => {
        console.log(error)
      })
  })
}

export default {
  host,
  // 登录
  Login (params) {
    return postFetch(apiUrl + 'Login/Login', params)
  },
  // 获取登录角色的权限菜单
  GetMenu (params) {
    return getFetch(apiUrl + 'Menu/GetMenus', params)
  },
  Post (url, params) {
    return postFetch(apiUrl + url, params)
  },
  Get (url, params) {
    return getFetch(apiUrl + url, params)
  },
  postLogin (url, params) {
    return postLogin(apiUrl + url, params)
  },
  getLogin (url, params) {
    return getLogin(apiUrl + url, params)
  }
}
