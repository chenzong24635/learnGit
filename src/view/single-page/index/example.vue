<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
  props: {
    dataTime: String,
    dataTotal: String,
    StartTime: String
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  computed: {
    timeList () {
      return this.dataTime.split(',')
    },
    totalData () {
      return this.dataTotal.split(',')
    }
  },
  mounted () {
    const option = {
      // Make gradient line here
      visualMap: [{
        show: false,
        type: 'continuous',
        seriesIndex: 0
      }],

      title: [{
        left: 'left',
        text: '15天用户增长量'
      }, {
        left: 'right',
        text: '统计:' + this.StartTime + '至今',
        textStyle: {
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'normal'
        }
      }],
      tooltip: {
        trigger: 'axis'
      },
      xAxis: [{
        data: this.timeList
      }],
      yAxis: [{
        splitLine: { show: false }
      }],
      grid: [{

      }],
      series: [{
        type: 'line',
        showSymbol: false,
        itemStyle: { normal: { label: { show: true, position: 'top', textStyle: { color: '#000000' } },
          color: '#0147a6',
          lineStyle: {
            color: '#0147a6'
          } } },
        data: this.totalData
      }]
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
