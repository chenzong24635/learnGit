<!--
 * @Description:
 * @version:
 * @Company: XuanMa
 * @Author: SnowBeatRain
 * @Date: 2019-07-22 10:14:03
 * @LastEditors: SnowBeatRain
 * @LastEditTime: 2019-08-15 13:54:42
-->
<template>
  <div>
    <span>首页</span>

  </div>
</template>

<script>
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    Example
  },
  data () {
    return {
    }
  },
  mounted () {
    if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === undefined || sessionStorage.getItem('token') == '') {
      this.$router.push({ name: 'login' })
    }
  },
  methods: {

  }
}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
