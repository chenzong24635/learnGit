<template>
  <Layout style="height: 100%;background:#e9ecf3" class="main">
    <Sider hide-trigger collapsible :width="220" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
              <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con" style="background:#fff">
          <!-- <img v-show="!collapsed" :src="maxLogo" key="max-logo" /> -->
          <!-- <img v-show="collapsed" :src="minLogo" key="min-logo"  style="border-radius:10px;"/> -->
        </div>
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">

      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con" style="border-left: 1px solid #f0f0f0">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <loginOut></loginOut>
          <user :message-unread-count="unreadCount" :user-avator="userAvator"/>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
          <!-- <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store> -->
        </header-bar>
      </Header>
      <Content class="main-content-con" style="padding-top:8px;">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper" style="border-left:1px solid #f0f0f0">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>

    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import LoginOut from './components/loginOut'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
// import minLogo from '@/assets/images/logo-min.jpg'
// import maxLogo from '@/assets/images/123.png'
import userInfor from './components/userInfor/userInfor'
import loginOutimg from '@/assets/images/iconImgthree.png'
import './main.less'
// eslint-disable-next-line no-unused-vars
import api from '@/libs/api'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop,
    userInfor,
    LoginOut
  },
  data () {
    return {
      collapsed: false,
      // minLogo,
      // maxLogo,
      loginOutimg,
      isFullscreen: false,
      menuLists: [],
      unreadCount: ''
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      return this.$store.state.user.avatorImgPath
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin',
      'getUnreadMessageCount'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    // this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    // 获取未读消息条数
    // this.getUnreadMessageCount()
  }
}
</script>
<style>
 .login-out-menu{
   background: #fff;
   padding:10px 0 5px 0
 }
 .login-btn-menu{
   width: 90%;
   margin:0px auto;
   background: #3ecdf9;
   color:#fff;
   font-size:14px;
   display: flex;
   flex-direction: column;
   justify-content: center;
   line-height: 22px;
   height: 50px;
   border-radius: 5px;
   cursor: pointer;
 }
  .login-btn-menu p,.login-small p{
    justify-content: center;
    display: flex;
    align-items: center
  }
  .login-btn-menu img,.login-small p img{
    width:20px;
    margin-right:3px
  }
  .login-small{
    background: #3ecdf9;
     width: 90%;
      margin:0px auto;
      display: flex;
      flex-direction: column;
   justify-content: center;
   line-height: 22px;
   height: 50px;
      border-radius: 5px;
      color:#fff;
       cursor: pointer;
  }
</style>
