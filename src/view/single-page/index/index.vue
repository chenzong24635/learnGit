<template>
  <div style="background:#fff;padding:20px" >
    <!-- <router-link to="/test">test</router-link> -->
    <div class="title">
      <span>实时概况</span>
      <!-- <Icon @click.native="tips" class="q" type="ios-help" /> -->
    </div>
    <div class="basic">
      <div class="basic-left" >
        <div class="basic-left-list">
          <p>支付金额<!-- <Icon @click.native="tips" class="q" type="ios-help" /> --></p>
          <p>{{data1.salesVolumeT}}</p>
          <p>昨日全天：{{data1.salesVolumeY}}</p>
        </div>
        <div id="myChart1" :style="{width: '100%'}"></div>
      </div>
      <div class="basic-right">
        <div class="basic-right-list">
          <p>浏览量</p>
          <p>{{data1.pageViewsT}}</p>
          <p>昨日全天：{{data1.pageViewsY}}</p>
        </div>
        <div class="basic-right-list">
          <p>支付订单数</p>
          <p>{{data1.orderNumberT}}</p>
          <p>昨日全天：{{data1.orderNumberY}}</p>
        </div>
        <div class="basic-right-list">
          <p>支付人数</p>
          <p>{{data1.payNumberT}}</p>
          <p>昨日全天：{{data1.payNumberY}}</p>
        </div>
        <div class="basic-right-list">
          <p>月销售额</p>
          <p>{{data1.salesVolumeM}}</p>
        </div>
      </div>
    </div>
    <div class="sel">
      <div class="tabs">
        <div @click="tabChange(item)" :class="[item.active ? 'active' : '', 'tab']" v-for="item in tabs" :key="item.name">{{item.name}}</div>
      </div>
      <div class="times">
        <span>时间筛选：</span>
        <!-- <Select v-model="modal1" style="width:120px;margin:0 10px 0 5px;">
            <Option v-for="item in select1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select> -->
        <DatePicker type="date" :options="options" :value="time" @on-change="changeDate" placeholder="日期选择" style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="bars">
      <div class="title">
        <span>核心指标</span>
        <!-- <Icon @click.native="tips" class="q" type="ios-help" /> -->
      </div>
    </div>

    <div class="swiperContent">
      <swiper id="swiper" :options="swiperOption">
        <swiper-slide @click.native="swiperClick(item)" v-for="item in swiperValues" :key="item.title" :class="item.active ? 'active' : ''">
          <p>{{item.name}}</p>
          <p>{{item.number}}</p>
          <Icon v-show="item.active" class="slide-icon" type="ios-checkmark" />
        </swiper-slide>
      </swiper>
      <div class="swiper-button-prev"><Icon type="ios-arrow-dropleft-circle" size="26" /></div>
      <div class="swiper-button-next"><Icon type="ios-arrow-dropright-circle" size="26" /></div>
    </div>
    <div style="width: 100%">

      <div id="myChart2" :style="{width: '100%', height: '400px'}"></div>
    </div>


  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
/**
 *@param {Object} data1 获取后台实时概况数据
 *@param {Object} option1 实时概况echart数据
 *@param {Object} data1 获取后台 运营视窗数据
 *@param {Object} option2 核心指标echart数据
 *
 *@param {Object} swiperOption 轮播参数
 *@param {Array} swiperValues 轮播内容
 *
 *@param {Object} modal 点击？模态框显示
 *
 *@param {Array} select1 时间下拉框选择
 *@param {String} modal1 当前时间下拉框选择值
 *
 *@param {Number} status 图表状态 0支付金额 1支付订单数 2支付人数 3浏览量
 *@param {Date} time 图表时间(yyyy-MM-dd)
*/
export default {
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      tabs: [
        {
          name: '运营视窗',
          active: true
        },
        /* {
          name: '管理视窗',
          active: false
        } */
      ],
      swiperOption: {
        speed: 1000,
        slidesPerView: 4,
        spaceBetween: 0,
        navigation: { // 上一张、下一张
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      swiperValues: [
        {
          status: 0,
          name1: 'salesVolume',
          name:'支付金额',
          number: 0,
          active: true
        },
        {
          status: 1,
          name1: 'orderNumber',
          name:'支付订单数',
          number: 0,
          active: false
        },
        {
          status: 2,
          name1: 'payNumber',
          name:'支付人数',
          number: 0,
          active: false
        },
        {
          status: 3,
          name1: 'pageViews',
          name:'浏览量',
          number: 0,
          active: false
        },
        /* {
          status: 0,
          name:'支付金额111',
          number: 0,
          more: '较前一日',
          active: false
        },
        {
          status: 1,
          name:'支付订单数',
          number: 0,
          more: '较前一日',
          active: false
        }, */
      ],
      data1: '',
      data2: '',
      modal: {
        title: '',
        content: ''
      },
      modal1: '1',
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
        }
      },
      select1: [
        {
          value: '0',
          label: '自然日'
        },
        {
          value: '1',
          label: '自然日1'
        }
      ],
      option1:{
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#515a6e'
            }
          },
          data: [],
          name: '时',
        },
        yAxis: {
          splitLine: {
            // show:false,
            lineStyle: {
              type: 'dotted',
            }
          },
          axisLabel: {
            // show:false,
          },
          axisLine: {
            // show:false,
            onZero: false,
            lineStyle: {
              color: '#515a6e'
            }
          },
          type: 'value'
        },
        series: [{
          name: '支付金额',
          data: [],
          type: 'line',
          color: '#ed6b23'
        }]
      },
      // chart1Height: 300,
      chart2Height: 100,
      myChart1: null,
      myChart2: null,
      option2:{
        title: {
          textStyle: {
            fontSize:12,
            color: '#515a6e'
          },
          // text: '最多显示4项指标'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 'left',
          data:[]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#515a6e'
            }
          },
          data: []
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#515a6e'
            }
          },
        },
        series: [{
          name:'',
          type:'line',
          data:[],
          color: '#3384eb'
        }]
      },
      status: 0,
      time: null
    }
  },
  mounted () {
    this.getData1()
    this.getData2()
    // 时间 默认当天（yyyy-MM-dd）
    this.time = new Date().toLocaleString().replace(/\//g,'-').replace(/\s.+/, '')
/*     this.drawLine1()
    this.drawLine2() */
  },
  methods: {
    tabChange(obj){
      this.tabs.map(item => {
        item.active = false
      })
      obj.active = true
    },
    swiperClick(obj) {
      // 已选指标
      this.swiperValues.map(item => {
        item.active = false
      })
      obj.active = !obj.active
      this.status = obj.status
      // this.myChart2.setOption(this.option2,true);
      this.getData2()
    },
    /* swiperClick(obj) { //多选
      // 已选指标
      let arr = this.swiperValues.filter(item => {
        return item.active
      })
      if(arr.length >= 4 && !obj.active){
        this.$Message.warning('最多显示四项指标');
        return
      }
      obj.active = !obj.active
      if(obj.active){ //选中后 图表线添加
        // 若series中不存在该数据 添加
        if(this.option2.series.every(item => item.name !== obj.name)){
          this.option2.series.push({
              name:obj.name,
              type:'line',
              stack: '总量',
              data:[320, 332, 301, 334, 390, 330, 320, 132, 101, 134, 90, 230]
          })
          // this.option2.legend.data.push(obj.name)
        }
      }else{ //取消选中后 图表线移除
        this.option2.series = this.option2.series.filter(item => {
          return obj.name !== item.name
        })
      }
      this.option2.legend.data = this.option2.series.filter(item=>item.name)
      this.myChart2.setOption(this.option2,true);
      // this.drawLine2()
      // this.refresh() //
    }, */
    changeDate(date, dateType) {
      this.time = date
      this.getData2()
    },
    tips() {
      this.$Modal.info({
          title: this.modal.title,
          content: this.modal.content
      });
    },
    drawLine1(){
      let myChart = this.$echarts.init(document.getElementById('myChart1'))
      myChart.setOption(this.option1);
      this.myChart1 = myChart
    },
    drawLine2(){
      let myChart = this.$echarts.init(document.getElementById('myChart2'))
      myChart.setOption(this.option2);
      this.myChart2 = myChart
    },
    getData1 () { // 实时概况
      this.GLOBAL.Get('get/statisticalInfo')
        .then((res) => {
          if(res.status === 1){
            this.data1 = res.result
            this.option1.xAxis.data = res.result.chartX
            this.option1.series[0].data = res.result.chartY
            let myChart = this.$echarts.init(document.getElementById('myChart1'))
            this.myChart1 = myChart
            myChart.setOption(this.option1,true);
            // 动态设置高度
            myChart.getDom().style.height = res.result.chartX.length * 10 + 30 + "px";
            myChart.resize();
          }
        })
    },
    getData2 () { // 运营视窗
      this.GLOBAL.Get('get/searchInfo',{
        status: this.status,
        time: this.time ? this.time : new Date().toLocaleString().replace(/\//g,'-').replace(/\s.+/, '')
      })
        .then((res) => {
          if(res.status === 1){
            let result = res.result
            // 轮播内容
            this.swiperValues.map(item => {
              switch (item.name1){
                case 'salesVolume':
                  item.number = result.salesVolume;
                  break;
                case 'payNumber':
                  item.number = result.payNumber;
                  break;
                case 'pageViews':
                  item.number = result.pageViews;
                  break;
                case 'orderNumber':
                  item.number = result.orderNumber;
                  break;
              }
            })
            // 选中名
            let name = this.swiperValues.filter(item => {
              return item.status === this.status
            })[0].name
            this.data2 = result
            this.option2.legend.data = [name]
            this.option2.xAxis.data = result.chartX
            this.option2.series[0].data = result.chartY
            this.option2.series[0].name = name
            // this.swiperValues.map
            let myChart = this.$echarts.init(document.getElementById('myChart2'))
            this.myChart2 = myChart
            myChart.setOption(this.option2,true);
            // 动态设置高度
            myChart.getDom().style.height = res.result.chartX.length * 20 + 30  + "px";
            myChart.resize();
          }
        })
    }
  }
}

</script>
<style scoped lang="less">
/deep/ #myChart1  > div,
/deep/ #myChart2  > div{
  max-width: 100%;
}

/deep/ .swiper-button-next:focus,
/deep/ .swiper-button-prev:focus,
/deep/ .ivu-icon:focus{
  outline: none
}
.swiperContent /deep/ .swiper-button-prev, .swiper-container-rtl .swiper-button-next,
.swiperContent /deep/ .swiper-button-next, .swiper-container-rtl .swiper-button-prev{
  background-image: none;
}
.swiperContent{
  position: relative;
  padding: 20px 50px;
}

#swiper{
  position: relative;
  // width: 90%;
  .swiper-slide{
    box-sizing: border-box;
    width: 25%;
    border:1px solid #ccc;
    padding: 20px 30px;
    cursor: pointer;
    color: #000;
    &>p:nth-child(2){
      font-size: 24px;
    }
    &>p:nth-child(3){
      color: #bebebe;
    }
    .slide-icon{
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 2;
      &:before{
        // font-size: 18px;
        color:#fff;
      }
    }
    &.active{
      position: relative;
      border-color:#3384eb;
      &:after{
        content:'';
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0;
        height: 0;
        border:10px solid transparent;
        border-right-color: #3384eb;
        border-bottom-color: #3384eb;
        // background-color: #3384eb;
      }
    }
  }
}

.basic{
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  &-left,
  &-right{
    width: 49.5%;
    box-sizing: border-box;
    &-list{
      width: 50%;
      margin: 5px 0;
      font-size: 14px;
      color: #000;
      &>p:nth-child(2){
        font-size: 26px;
      }
      &>p:nth-child(3){
        font-size: 12px;
        color: #bebebe;
      }
    }
  }
  &-left{
    border:1px solid #e6e6e6;
    padding-top: 5px;
    &-list{
      padding-left: 40px;
      margin-bottom: 0;
    }
  }
  &-right{
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    font-size: 14px;
    padding: 10px 60px;
    color:#000;
    border:1px solid #f8f8f8;
    background-color: #f8f8f8;
  }
}
.sel{
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  background-color: #f8f8f8;
  padding: 5px 20px;
}
.tabs{
  display: flex;
  justify-content: flex-start;
  .tab{
    cursor: pointer;
    line-height: 32px;
    font-size: 15px;
    margin-right: 20px;
    border-bottom: 2px solid transparent;
    &.active{
      border-bottom-color:#3384eb;
    }
  }
}
.bars{
  margin-top: 20px;
  padding-right: 20px;
  background-color: #f8f8f8;

  /deep/ .ivu-tabs{width: 100%;}
  /deep/ .ivu-tabs-bar{
    width: 100%;
    border-bottom:  none;
    background-color: #f8f8f8;
  }

}
.title{
  position: relative;
  font-size: 14px;
  // margin-bottom: 15px;
  padding: 10px 20px;
  color:#000;
  background-color: #f8f8f8;
  &:before{
    content:'';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    margin: auto 0;
    width: 5px;
    height: 55%;
    background-color: #fe781d;
  }
}
/deep/ .q.ivu-icon-ios-help{
  cursor: pointer;
  margin-left: 4px;
  border-radius: 50%;
  background-color: #bbbbbb;
  &:before{
    color:#fff;
  }
}



</style>
