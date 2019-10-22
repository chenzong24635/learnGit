
<template>
  <div>

    <div style="margin-bottom:20px">
      <Input
        v-model="keyword"
        placeholder="关键字"
        style="width: 150px"
        :clearable="true"
        @on-clear="getOrderList"
        search
      />
      <span style="margin-left:10px;">订单状态：</span>
      <Select v-model="status" style="width:200px" @on-change="getOrderList">
        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <span style="margin-left:10px;">时间筛选：</span>
      <DatePicker
        type="daterange"
        split-panels
        placeholder="选择时间"
        style="width: 200px"
        @on-change="dataTime2"
        @on-clear="clearTime2"
      ></DatePicker>
      <Button type="primary" class="check-style" @click="getOrderList" style="margin-left:10px;">搜索</Button>
    </div>
    <div>
      <Table  :columns="orderTitle" :data="orderList" border></Table>
    </div>
    <div class="page-style" v-if="totalPage!=0">
      <Page :total="totalPage" show-total :page-size="10" @on-change="changePage" />
    </div>
    <!--查看商品信息-->
    <Modal v-model="lookList" width="800" :footer-hide="true">
      <ul class="remark-boxs">
        <li class="first-heard remark-model-width">
          <div style="width:65%">商品名称</div>
          <div>数量</div>
          <div>单位</div>
          <div>价格</div>
        </li>
        <li class="list-infor remark-model-width" v-for="(items,index) in lookGood" :key="index">
          <div style="width:65%">{{items.goodsName}}</div>
          <div>{{items.goodsCount}}</div>
          <div>{{items.unit}}</div>
          <div>{{items.price}}</div>
          <!-- <div style="width:15%">{{items.specDetailsMap | SpecMap}}</div> -->
        </li>
      </ul>
    </Modal>
    <!--发货-->
    <Modal v-model="fahuo" width="420" :footer-hide="true">
      <div style="width:100%;height:40px;"></div>
      <div class="xinzeng-item">
        <label>快递公司</label>
        <Select
          v-model="expressCompany"
          style="width:300px"
          @on-change="changeCompany"
          :label-in-value="true"
        >
          <Option v-for="item in CompanyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="xinzeng-item">
        <label>快递单号</label>
        <Input v-model="shipCode" placeholder="快递单号" style="width: 300px;margin-left:10px;" />
      </div>
      <Button type="primary" class="check-style-model" @click="fahuoEvent">确认发货</Button>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pageIndex: 1,
      startTime: '',
      endTime: '',
      keyword: '',
      status: 0,
      model1: '',
      totalPage: 0,
      lookList: false,
      lookGood: '',
      fahuo: false,
      shipCode: '',
      expressCompany: '',
      CompanyName: '',
      orderID: '',
      CompanyList: [
        {
          value: 0,
          label: '中通'
        },
        {
          value: 1,
          label: '申通'
        },
        {
          value: 2,
          label: '中国邮政'
        }
      ],
      statusList: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '待审核'
        },
        {
          value: '2',
          label: '待发货'
        },
        {
          value: '4',
          label: '已发货'
        },
        {
          value: '3',
          label: '已失效'
        }
      ],
      orderTitle: [
        {
          title: '门店名称',
          key: 'userName',
          align: 'center',
        },
        {
          title: '手机号码',
          key: 'phone',
          align: 'center',
        },
        {
          title: '收货地址',
          key: 'address',
          align: 'center',
        },
        {
          title: '商品信息',
          key: 'order',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                color: '#2d8cf0',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.lookGood = this.orderList[params.index].orderItems
                  this.lookList = true
                }
              }
            }, '查看商品信息')
          }
        },
        {
          title: '订单总价',
          key: 'totalPrice',
          align: 'center',
        },
        {
          title: '支付方式',
          key: 'paymentType',
          align: 'center',
          render: (h, params) => {
            if (params.row.paymentType === 0) {
              return h('span', '微信支付')
            }else if (params.row.paymentType === 1){
              return h('span', '支付宝支付')
            }
          }
        },
        {
          title: '支付凭证',
          key: 'voucherImg',
          align: 'center',
          render: (h, params) => {
            if(!params.row.voucherImg)return
            let voucherImg = params.row.voucherImg || null
            let img = voucherImg ? voucherImg.includes('http://')? voucherImg : 'http://' + voucherImg : voucherImg
            return h('img',{
              attrs: {
                src: img
              },
              style: {
                width: '100%',
                height: '100%',
                display: 'block',
                margin: '0 auto'
              }
            })
          }
        },
        {
          title: '下单时间',
          key: 'addTime',
          align: 'center',
        },
        {
          title: '订单状态',
          key: 'payStatus',
          align: 'center',
          render: (h, params) => {
            if (params.row.payStatus === 0) {
              return h('div', {
                style: {
                  color: '#f90'
                }
              }, '待审核')
            } else if (params.row.payStatus === 1&& params.row.orderStatus === 0) {
              return h('div', {
                style: {
                  color: 'rgb(45, 140, 240)'
                }
              },'待发货')
            } else if (params.row.payStatus === 1 && params.row.orderStatus === 1) {
              return h('div', {
                style: {
                  color: 'rgb(45, 140, 240)'
                }
              },'已发货')
            } else if (params.row.payStatus === 2) {
              return h('div', {
                style: {
                  color: '#f44'
                }
              }, '已失效')
            }
          }
        },
        {
          title: '操作',
          key: 'totalPrice',
          align: 'center',
          width: '200',
          render: (h, params) => {
            if (params.row.payStatus === 0) {
              return h('div',[
                h('Button',{
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    margin: '5px 3px'
                  },
                  on: {
                    click: () => {
                      this.confirm(params.row.orderID)
                    }
                  }
                },'确认收款'),
                h('Button',{
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    margin: '5px 3px'
                  },
                  on: {
                    click: () => {
                      this.cancle(params.row.orderID)
                    }
                  }
                },'取消订单')
              ])
            }
            if (params.row.payStatus === 1&& params.row.orderStatus === 0) {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    // this.fahuo = true
                    this.orderID = params.row.orderID
                    this.GLOBAL.Post('order/deliver', {
                      expressCompany: '中国邮政',
                      shipCode: '313abda312ads',
                      orderID: this.orderID
                    }).then((res) => {
                      if(res.status === 1){
                        this.getOrderList()
                        // this.fahuo = false
                        this.$Message.success(res.result)
                      }else{
                        this.$Message.warning(res.result)
                      }
                    })
                  }
                }
              }, '发货')
            }
          }
        }
      ],
      orderList: []
    }
  },
  watch:{
    "$route":function(to,from){
      if (to.params.id !== from.params.id) {
        this.keyword = to.params.id
        this.getOrderList()
      }
    }
  },
  mounted () {
    this.keyword = this.$route.params.id
    this.getOrderList()
    // this.getCompany()
  },
  filters: {
    SpecMap (val) {
      let spec = ''
      for (let key in val) {
        spec += key + ',' + val[key] + ' '
      }
      return spec
    }
  },
  methods: {
    cancle(orderID){
      let that =this
      this.$Modal.confirm({
        title: '确定取消该订单？',
        content: '',
        onOk: () => {
          this.GLOBAL.Get('order/delete', {orderID}).then((res) => {
            if (res.status === 1) {
              that.$Message.success('' + res.result + '')
              that.getOrderList()
            } else {
              that.$Message.error('' + res.result + '')
            }
          })
        },
        onCancel: () => {}
      })
    },
    confirm(orderID){
      let that =this
      this.$Modal.confirm({
        title: '确定收款？',
        content: '',
        onOk: () => {
          this.GLOBAL.Get('order/confirm', {orderID}).then((res) => {
            if (res.status === 1) {
              that.$Message.success('' + res.result + '')
              that.getOrderList()
            } else {
              that.$Message.error('' + res.result + '')
            }
          })
        },
        onCancel: () => {}
      })
    },
    getOrderList () {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: 10,
        startTime: this.startTime,
        endTime: this.endTime,
        keyword: this.keyword,
        status: this.status
      }
      this.GLOBAL.Get('order/get', params).then((res) => {
        this.orderList = res.result.list
        this.totalPage = res.result.totalRecord
      })
    },
    getCompany () {
      /* this.GLOBAL.Get('order/expressCompany', {}).then((res) => {
        for (var i in res.result) {
          this.CompanyList.push({
            value: i,
            label: res.result[i]
          })
        }
      }) */
    },
    changeCompany (p) {
      this.CompanyName = p.label
    },
    dataTime2 (s) {
      this.startTime = s[0] + ' ' + '00:00:00'
      this.endTime = s[1] + ' ' + '00:00:00'
    },
    clearTime2 () {
      this.startTime = ''
      this.endTime = ''
      this.pageIndex = 1
      this.getOrderList()
    },
    changePage (e) {
      this.pageIndex = e
      this.getOrderList()
    },
    fahuoEvent () {
      let params = {
        expressCompany: this.CompanyName,
        shipCode: this.shipCode,
        orderID: this.orderID
      }
      if (this.CompanyName === '') {
        this.$Message.warning('请选择快递公司')
        return
      }
      if (this.shipCode === '') {
        this.$Message.warning('请输入快递单号')
        return
      }
      this.GLOBAL.Post('order/deliver', params).then((res) => {
        if(res.status === 1){
          this.getOrderList()
          this.fahuo = false
          this.$Message.success(res.result)
        }else{
          this.$Message.warning(res.result)
        }
      })
    }
  }
}
</script>
<style scoped>
ul,
li {
  list-style: none;
}
.remark-boxs .first-heard {
  overflow: hidden;
}

.remark-boxs .first-heard div {
  float: left;
  line-height: 44px;
  font-size: 14px;
  color: #101010;
  text-align: center;
}

.remark-boxs .list-infor {
  display: flex;
}

.remark-boxs .list-infor div {
  line-height: 24px;
  font-size: 12px;
  color: #999999;
  clear: both;
  overflow: hidden;
  text-align: center;
}
.remark-model-width div {
  width: 10%;

}
</style>
