<template>
  <div style="background:#fff;padding:20px" >
    <router-link to="/test">test</router-link>
    <div class="title">
      <span>实时概况</span>
      <Icon @click.native="tips" class="q" type="ios-help" />
    </div>
    <div class="basic">
      <div class="basic-left" >
        <div id="myChart1" :style="{width: '100%', height: '100%'}"></div>
      </div>
      <div class="basic-right">
        <div class="basic-right-list">
          <p>浏览量</p>
          <p>0</p>
          <p>昨日全天：0</p>
        </div>
        <div class="basic-right-list">
          <p>浏览量</p>
          <p>0</p>
          <p>昨日全天：0</p>
        </div>
        <div class="basic-right-list">
          <p>浏览量</p>
          <p>0</p>
          <p>昨日全天：0</p>
        </div>
      </div>
    </div>

    <div class="sel">
      <Tabs>
        <TabPane label="运营视窗" >
            <div class="title">
              <span>核心指标</span>
              <!-- <Icon @click.native="tips" class="q" type="ios-help" /> -->
            </div>
            <div class="swiperContent">
              <swiper id="swiper" :options="swiperOption">
                <swiper-slide @click.native="swiperClick(item)" v-for="item in swiperValues" :key="item.title" :class="item.active ? 'active' : ''">
                  <p>{{item.name}}</p>
                  <p>{{item.number}}</p>
                  <p>{{item.more}}</p>
                  <Icon v-show="item.active" class="slide-icon" type="ios-checkmark" />
                </swiper-slide>
              </swiper>
              <div class="swiper-button-prev"><Icon type="ios-arrow-dropleft-circle" size="30" /></div>
              <div class="swiper-button-next"><Icon type="ios-arrow-dropright-circle" size="30" /></div>
            </div>

            <div id="myChart2" :style="{width: '100%', height: '400px'}"></div>

        </TabPane>
        <TabPane label="管理视窗" >管理视窗22</TabPane>
      </Tabs>
      <div class="sel-times">
        <span>时间筛选：</span>
        <Select v-model="modal1" style="width:120px;margin:0 10px 0 5px;">
            <Option v-for="item in select1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <DatePicker type="date" :value="dateValue" @on-change="changeDate" placeholder="Select date" style="width: 200px"></DatePicker>
      </div>
    </div>

    <!-- <div class="index-panel-box">
      <div class="list">
        <div class="flex-div">
          <img src="../../../assets/images/iconImgTwo.png" height="35">
          <div>
            <div class="list-num"><span>{{data.salesVolumeM}}</span>元</div>
            <div class="list-text">月销售额</div>
          </div>
        </div>
      </div>
    </div> -->

  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import api from '@/libs/api'
/**
 *@param {}
*/
export default {
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
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
          name:'支付金额',
          number: 0,
          more: '较前一日',
          active: false
        },
        {
          name:'支付订单数',
          number: 0,
          more: '较前一日',
          active: false
        },
        {
          name:'支付人数',
          number: 0,
          more: '较前一日',
          active: false
        },
        {
          name:'浏览量',
          number: 0,
          more: '较前一日',
          active: false
        },
        {
          name:'支付人数111',
          number: 0,
          more: '较前一日',
          active: false
        },
        {
          name:'浏览量222',
          number: 0,
          more: '较前一日',
          active: false
        },
      ],
      data: '',
      modal: {
        title: '',
        content: ''
      },
      dateValue: '2007-10-14',
      modal1: '1',
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
          xAxis: {
              type: 'category',
              data: ['0', '1', '2', '3', '4', '5', '6','7']
          },
          yAxis: {
              type: 'value'
          },
          series: [{
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line'
          }]
      },
      myChart1: null,
      myChart2: null,
      option2:{
          title: {
            textStyle: {
              fontSize:12,
              color: '#ccc'
            },
            text: '最多显示4项指标'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            left: '150px',
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
                    color: 'red'
                }
            },
            axisPointer: {
                /* label: {
                    formatter: function (params) {
                        return '降水量  ' + params.value
                            + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                    }
                } */
            },
            data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
          },
          yAxis: {
              type: 'value'
          },
          series: [
              /* {
                  name:'邮件营销',
                  type:'line',
                  stack: '总量',
                  data:[120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230,]
              }   data:[320, 332, 301, 334, 390, 330, 320, 132, 101, 134, 90, 230,]
              } */
          ]
      }
    }
  },
  mounted () {
    if(sessionStorage.getItem('series')){
      this.option2.series = JSON.parse(sessionStorage.getItem('series'))
    }
    if(sessionStorage.getItem('swiperValues')){
      this.swiperValues = JSON.parse(sessionStorage.getItem('swiperValues'))
    }
    this.swiperValues.map(item => {
      if(item.active){
        this.option2.legend.data.push(item.name)
      }
    })
    this.drawLine1()
    this.drawLine2()
    this.getData()
  },
  watch: {
    'option2.series': {
      handler(newName, oldName) {
        console.log(this.$echarts)
        this.myChart2.setOption(this.option2,true);
        // document.getElementById('myChart2').setAttribute('_echarts_instance_', '')
        // this.$echarts.setOption(this.option2,true);
        // this.drawLine2()
        console.log('new series',newName)
        console.log('old series', oldName)
        console.log('this.option2.series',this.option2.series)
      },
      deep: true //深度监听
    }
  },
  methods: {
    swiperClick(obj) {
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
        }
      }else{ //取消选中后 图表线移除
        this.option2.series = this.option2.series.filter(item => {
          return obj.name !== item.name
        })
      }
      /* sessionStorage.setItem('series',JSON.stringify(this.option2.series))
      sessionStorage.setItem('swiperValues',JSON.stringify(this.swiperValues)) */

      // this.drawLine2()
      // this.refresh() //
    },
    changeDate(date, dateType) {
      console.log(date, dateType)
    },
    tips() {
      this.$Modal.info({
          title: this.modal.title,
          content: this.modal.content
      });
    },
    drawLine1(){
      let myChart = this.$echarts.init(document.getElementById('myChart1'))
      this.myChart1 = myChart
      myChart.setOption(this.option1);
    },
    drawLine2(){
      let myChart = this.$echarts.init(document.getElementById('myChart2'))
      this.myChart2 = myChart
      myChart.setOption(this.option2);
    },
    getData () {
      this.GLOBAL.Get('order/get/statisticalInfo', {token: sessionStorage.getItem('token')})
        .then((res) => {
          if(res.status === 1){
            this.data = res.result
          }
        })
    },
    refresh () {
      this.$router.replace({
        path: '/refresh',
        query: {
          t: Date.now()
        }
      })
    },
  }
}

</script>
<style scoped lang="less">
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
  padding: 0 50px;
}
/* /deep/ #myChart1 > div{
  max-width: 100%!important;
} */
#swiper{
  position: relative;
  // width: 90%;
  .swiper-slide{
    box-sizing: border-box;
    width: 25%;
    border:1px solid #ccc;
    padding: 20px 30px;
    cursor: pointer;
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
  &-left,
  &-right{
    width: 49.5%;
    // box-sizing: border-box;
  }
  &-left{
    border:1px solid #e6e6e6;
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
    &-list{
      width: 50%;
      margin: 15px 0;
      &>p:nth-child(2){
        font-size: 24px;
      }
      &>p:nth-child(3){
        color: #bebebe;
      }
    }
  }
}
.sel{
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  // padding-right: 20px;
  // background-color: #f8f8f8;
  .cnt{
    // background-color: #fff;
  }
  .title{
    margin-top: 10px;
  }
  /deep/ .ivu-tabs{width: 100%;}
  /deep/ .ivu-tabs-bar{
    width: 100%;
    border-bottom:  none;
    background-color: #f8f8f8;
  }
  &-times{
    position: absolute;
    right: 0;
    top: 0;
  }
}
.title{
  position: relative;
  font-size: 14px;
  margin-bottom: 15px;
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
/* --- */

.index-panel-box {
  overflow: hidden;
  display: inline-block;
}

.index-panel-box .list {
  /* width: 250px; */
  padding: 30px;
  background: #2D8cF0;
  float: left;
  margin: 10px;
  color: #fff;
  font-size: 14px;
  border-radius: 10px;
}
.list-num,
.list-text{
  text-align: center;
}
.list-num span{
  color: #fff;
  font-size: 30px;
  margin-right: 10px;
}
.flex-div {
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #dcdee2;
}
.flex-div img {
  margin-right: 20px;
}
.index-panel-box .list:hover,.index-panel-box .all-money-number .top-money-total:hover,.all-pople-look:hover{
  -moz-box-shadow:2px 2px 6px 2px rgba(20%,20%,40%,0.5);
  -webkit-box-shadow:2px 2px 6px 2px rgba(20%,20%,40%,0.5);
  box-shadow:2px 2px 6px 2px rgba(20%,20%,40%,0.5);
  transition: 0.2s
}
</style>
