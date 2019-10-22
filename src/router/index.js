import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
// eslint-disable-next-line no-unused-vars
import store from '@/store'
import iView from 'iview'
// eslint-disable-next-line no-unused-vars
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
// eslint-disable-next-line no-unused-vars
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes
})
// eslint-disable-next-line no-unused-vars
const LOGIN_PAGE_NAME = 'login'

// eslint-disable-next-line no-unused-vars
const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if (!sessionStorage.getItem('token') && to.name !== 'login') {
    next({
      name: 'login'
    })
  } else if (sessionStorage.getItem('token') && to.name === 'login') {
    next({
      name: 'home'
    })
  } else if (to.matched.length === 0) { // 如果路由中没有这个页面就跳转到404
    next({
      name: 'error_404'
    })
  }
  next()
})
router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
