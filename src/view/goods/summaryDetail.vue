
<template>
  <div>

    <div style="margin-bottom:20px">
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
      <Table  :columns="orderTitle" :data="orderList" border @on-sort-change="sortChange"></Table>
    </div>
    <div class="page-style" v-if="totalPage!=0">
      <Page :total="totalPage" show-total :page-size="10" @on-change="changePage" />
    </div>
    <Modal v-model="detailShow" width="800" :footer-hide="true">
      <ul class="remark-boxs">
        <li class="first-heard remark-model-width">
          <div style="width:65%">商品名称</div>
          <div>数量</div>
          <div>单位</div>
          <div>价格</div>
        </li>
        <li class="list-infor remark-model-width" v-for="(items,index) in details" :key="index">
          <div style="width:65%">{{items.goodsName}}</div>
          <div>{{items.goodsCount}}</div>
          <div>{{items.unit}}</div>
          <div>{{items.price}}</div>
          <!-- <div style="width:15%">{{items.specDetailsMap | SpecMap}}</div> -->
        </li>
      </ul>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      details: {},
      detailShow: false,
      pageIndex: 1,
      pageSize: 10,
      startTime: '',
      endTime: '',
      model1: '',
      totalPage: 0,
      orderTitle: [
        {
          title: '商品信息',
          key: 'goodsName',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                padding: '4px 0',
                color: '#2d8cf0',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.getDetail(params.row.id)
                  this.$router.push({name: 'lookgoods',  params: {id: params.row.id}})
                  // this.$router.push({name: 'updategoods',  params: {id: params.row.id}})
                }
              }
            }, params.row.goodsName)
          }
        },
        {
          title: '点击量',
          key: 'clickCount',
          align: 'center',
          // sortable: true,
          sortable: 'custom'
        },
        {
          title: '支付人数',
          key: 'payNumber',
          align: 'center',
          // sortable: true,
          sortable: 'custom'
        },
        {
          title: '支付商品件数',
          key: 'goodsCount',
          align: 'center',
          // sortable: true,
          sortable: 'custom'
        },
        {
          title: '商品支付金额',
          key: 'goodsPrice',
          align: 'center',
          // sortable: true,
          sortable: 'custom'/* ,
          sortMethod: function (a,b,type) {
            if(type === 'desc'){
              return a>b?b:a;
            }else return a>b?a:b;
          } */
        },
        {
          title: '单品转化率',
          key: 'conversionRate',
          align: 'center',
        }
      ],
      orderList: [],
      sortObj: {
        sortOption: 'clickCountSort',
        sort: false
      }
    }
  },
  mounted () {
    this.getOrderList()
  },
  methods: {
    getDetail(id) {
      // GET /goods/goodsDetails
      /* this.GLOBAL.Get('goods/goodsDetails', {id}).then((res) => {
        this.detailShow = true
        this.details
      }) */
    },
    sortChange(item) {
      let sortOption = 'clickCountSort'
      switch(item.key){
        case "clickCount":
          sortOption = 'clickCountSort';
          break;
        case "payNumber":
          sortOption = 'payNumberSort';
          break;
        case "goodsCount":
          sortOption = 'goodsCountSort';
          break;
        case "goodsPrice":
          sortOption = 'goodsPriceSort';
          break;
      }
      if(item.order === 'asc'){
        this.sortObj.sort = true
      }else{
        this.sortObj.sort = false
      }
      this.sortObj.sortOption = sortOption
      this.getOrderList()
    },
    getOrderList () {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        startTime: this.startTime,
        endTime: this.endTime,
        sortOption: this.sortObj.sortOption,
        sort: this.sortObj.sort
      }
      this.GLOBAL.Get('goods/goodsInfo', params).then((res) => {
        this.orderList = res.result.list
        this.totalPage = res.result.totalRecord
      })
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
