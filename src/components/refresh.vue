<template>
  <div class="">
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  data () {
    return {}
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {//
      // location.reload()
      vm.$router.replace(from.path)
    })
  },
  created () {},
  methods: {}
}
</script>
<style scoped lang="less" scoped>
</style>
