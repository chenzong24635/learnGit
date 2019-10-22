<template>
  <div class="error-store">
    <Badge  :count="2">
      <Button type="text" @click="openErrorLoggerPage">
        <Icon :size="30" type="ios-text"/>

      </Button>
    </Badge>
    <span>消息</span>
  </div>
</template>

<script>
export default {
  name: 'ErrorStore',
  props: {
    count: {
      type: Number,
      default: 0
    },
    hasRead: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    countComputed () {
      return this.hasRead ? 0 : this.count
    }
  },
  methods: {
    openErrorLoggerPage () {

    }
  }
}
</script>

<style lang="less">
.error-store{
  padding:0 20px;
  cursor: pointer;
  .ivu-badge-dot{
    top: 20px;
  }
  .ivu-btn.ivu-btn-text{
    padding: 5px 1px 6px;
  }
  .ivu-badge-count{
    top:6px;
  }
}
.error-store:hover{
  background: #f2f4f9
}
</style>
