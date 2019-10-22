<template>
  <div class="user-avatar-dropdown">
    <!-- <Badge @click.native="showMessage">
      <Avatar :src="userAvatar"/>
      {{}}
    </Badge> -->
    <Badge :dot="unrede" @click.native="showMessage">
        <Icon type="ios-notifications-outline" size="26"></Icon>
    </Badge>
    <Modal  v-model="show" width="90%" :footer-hide="true">
    </Modal>
    <Modal class="lists" v-model="show" width="90%" :footer-hide="true">
      <h2 style="text-align:center;margin-bottom:20px">消息通知</h2>
      <Table :columns="listsHead" :data="lists" border>
        <template slot-scope="{row}" slot="action">
          <Button type="primary" size="small" style="margin-right: 8px" @click="check(row)">查看</Button>
        </template>
      </Table>
      <div class="page-style" v-if="totalPage!=0">
        <Page :total="totalPage" show-total :page-size="pageSize" @on-change="changePage" />
      </div>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    }
  },
  data() {
    return{
      unrede: false,
      show: false,
      listsHead: [
        {
          title: '时间',
          key: 'addTime',
        },
        {
          title: '内容',
          key: 'content',
        },
        {
          title: '通知类型',
          key: 'msgType',
          render: (h, params) => {
            if(params.row.msgType)return h('span', '订单通知')
            else return h('span', '库存预警')
          }
        },
        {
          title: '读取状态',
          key: 'status',
          render: (h, params) => {
            if(params.row.status)return h('span', '已读')
            else return h('span', '未读')
          }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      lists: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 1,
      status: 0,
      userId: '',
      websocket: null
    }
  },
  created() {
    this.unredes()
    this.getUserId()
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function() {
      this.websocket.close();
    }
  },
  destoryed() {
    this.websocket.close();
  },
  methods: {
    check(row){
      this.GLOBAL.Post('notice/read', {
        notices: [
          row.id
        ],
        token: sessionStorage.getItem('token')
      }).then((res) => {
        if(res.status === 1){
          if(row.goodsID){
            this.$router.push({name: 'lookgoods',params:{id: row.goodsID}})
          }else if(row.orderID){
            this.$router.push({name: 'orderList',params:{id: row.orderID}})
          }
          this.show = false
        }
      })
    },
    getUserId() {
      this.GLOBAL.Get('admin/adminInfo', {token: sessionStorage.getItem('token')})
        .then((res) => {
          if(res.status === 1){
            this.userId = res.result.id
          }
        })
        .then(this.getUnrede)
    },
    unredes(){
      this.GLOBAL.Get('notice/unrede', {token: sessionStorage.getItem('token')}).then((res) => {
        if(res.status === 1){
          this.unrede = res.result
        }
      })
    },
    getUnrede() { // 获取是否有未读消息
      let _this = this
      if ('WebSocket' in window) {
          this.websocket = new WebSocket('ws://'+this.GLOBAL.host+'/tea_shop/webSocket/' + this.userId);

          //连接成功建立的回调方法
          this.websocket.onopen = function() {
            console.log('连接成功')
          }
          //接收到消息的回调方法
          this.websocket.onmessage = function(event) {
            _this.unredes()
            // _this.unrede = true
            _this.$Notice.info({
                title: '新消息提醒',
                desc: event.data,
                duration: 0
            });
            // console.log(event,"这是后台推送的消息："+event.data);
          }
      } else {
        console.log('不支持Websocket')
        setInterval(()=>{
          this.unredes()
        },6000)
      }
    },
    getLists() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        status: this.status,
        token: sessionStorage.getItem('token')
      }
      this.GLOBAL.Get('notice/notice', params).then((res) => {
        this.lists = res.result.list
        this.totalPage = res.result.totalRecord
      })
    },
    showMessage(){
      this.show = !this.show
      this.getLists()
    },
    changePage (e) {
      this.pageIndex = e
      this.getOrderList()
    },
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      sessionStorage.removeItem('token')
      this.$router.push({
        name: 'login'
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    }
  }
}
</script>
<style >
  /* div /deep/ .ivu-table-tbody tr:hover{
    cursor: pointer;
  } */
  .lists{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999999999;
  }
</style>
