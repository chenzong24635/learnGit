<!--
 * @Description:
 * @version:
 * @Company: XuanMa
 * @Author: SnowBeatRain
 * @Date: 2019-07-22 10:14:03
 * @LastEditors: SnowBeatRain
 * @LastEditTime: 2019-08-15 13:51:16
 -->
<template>
  <div>
     <div  class="full-screen-btn-cons">
    <Tooltip content="退出" placement="bottom">
       <Icon type="md-exit" :size="30" @click="loginOut"/>
    </Tooltip>
  </div>
  </div>
</template>
<script>

export default {
  data () {
    return {

    }
  },
  methods: {
    loginOut () {
      sessionStorage.removeItem('token')
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
<style lang="less" >
.full-screen-btn-cons{
    margin-left:6px;
    cursor: pointer;
 .ivu-tooltip-rel{
  height: 64px;
  line-height: 56px;
  i{
    color:#37ccf6
  }
 }
}
</style>
