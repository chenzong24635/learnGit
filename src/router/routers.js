import Main from '@/components/main'
// import parentView from '@/components/parent-view'

const RouterList = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/message',
    name: 'message',
    meta: {
      title: 'message',
      hideInMenu: true
    },
    component: () => import('@/view/single-page/message/index.vue')
  },
  {
    path: '/refresh',
    name: 'refresh',
    meta: {
      title: 'refresh',
      hideInMenu: true
    },
    component: () => import('_c/refresh.vue')
  },
  /* {
    path: '/test',
    name: 'test',
    meta: {
      title: 'test',
      hideInMenu: true
    },
    component: () => import('@/view/test.vue')
  }, */
  {
    path: '/',
    name: '_hom',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/index/index.vue')
      }
    ]
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      icon: 'md-home',
      title: '首页'
    },
    component: import('@/view/single-page/index/index.vue'),

  },
  {
    path: '/admin',
    name: 'admin',
    meta: {
      icon: 'ios-person',
      title: '管理员管理'
    },
    component: Main,
    children: [
      {
        path: 'adminList',
        name: 'adminList',
        meta: {
          title: '管理员列表',
          hideInMenu: false
        },
        component: () => import('@/view/admin/adminList.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'md-person',
      title: '用户管理'
    },
    component: Main,
    children: [
      {
        path: 'userList',
        name: 'userList',
        meta: {
          title: '门店列表',
          hideInMenu: false
        },
        component: () => import('@/view/user/userList.vue')
      }
    ]
  },
  {
    path: '/messages',
    name: 'messages',
    meta: {
      icon: 'md-text',
      title: '公告栏管理'
    },
    component: Main,
    children: [
      {
        path: '/message1',
        name: 'message1',
        meta: {
          title: '公告栏发布',
          hideInMenu: false
        },
        component: () => import('@/view/messages/messages.vue')
      },
      {
        path: '/message2',
        name: 'message2',
        meta: {
          title: '公告栏修改',
          hideInMenu: false
        },
        component: () => import('@/view/messages/messages.vue')
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      icon: 'ios-document',
      title: '订单管理'
    },
    component: Main,
    children: [
      {
        path: '/orderList/:id?',
        name: 'orderList',
        meta: {
          title: '订单列表',
          hideInMenu: false
        },
        component: () => import('@/view/order/orderList.vue')
      }
    ]
  },
  {
    path: '/goods',
    name: 'goods',
    meta: {
      icon: 'md-water',
      title: '商品管理'
    },
    component: Main,
    children: [
      {
        path: 'goodscalss',
        name: 'goodscalss',
        meta: {
          title: '商品分类',
          hideInMenu: false
        },
        component: () => import('@/view/goods/goodscalss.vue')
      },
      {
        path: 'addgoods/:id?',
        name: 'addgoods',
        meta: {
          title: '添加商品',
          hideInMenu: false
        },
        component: () => import('@/view/goods/addgoods.vue')
      },
      {
        path: 'updategoods/:id',
        name: 'updategoods',
        meta: {
          title: '修改商品',
          hideInMenu: true
        },
        component: () => import('@/view/goods/updategoods.vue')
      },
      {
        path: 'goodsList',
        name: 'goodsList',
        meta: {
          title: '商品列表',
          hideInMenu: false
        },
        component: () => import('@/view/goods/goodsList.vue')
      },
      {
        path: '/lookgoods/:id',
        name: 'lookgoods',
        meta: {
          title: '商品详情',
          hideInMenu: true
        },
        component: () => import('@/view/goods/lookgoods.vue')
      },
      {
        path: '/summaryDetail',
        name: 'summaryDetail',
        meta: {
          title: '汇总单品明细',
          hideInMenu: false
        },
        component: () => import('@/view/goods/summaryDetail.vue')
      },
      {
        path: '/advertGoodsList',
        name: 'advertGoodsList',
        meta: {
          title: '广告位',
          hideInMenu: false
        },
        component: () => import('@/view/goods/advertGoodsList.vue')
      }
    ]
  },
  {
    path: '/upload',
    name: 'upload',
    meta: {
      hideInMenu: true
    },
    component: () => import('_c/uploadImg.vue')
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]

export default RouterList
