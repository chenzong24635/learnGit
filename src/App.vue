<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
@import './assets/layui/common.css';

.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
  .line-clamp {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  cursor:pointer;
  color:rgb(68, 126, 217)
}
.xinzeng-item{
   display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}
  .xinzeng-item label {
    color: #000;
    font-size: 14px;
  }
    .check-style-model {
    display: block !important;
    margin: 30px auto 0 auto
  }
    .page-style {
    text-align: right;
    margin-top: 30px;
  }
    .line-clamp {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  cursor:pointer;
  color:rgb(68, 126, 217)
}

.role-modal .ivu-modal-body {
  max-height: 600px;
  overflow: auto;
}
.p20{padding: 20px;}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clearfix{
  position: relative;
}
.clearfix:before,
.clearfix:after{
  content: " ";
  visibility: hidden;
  display: block;
  font-size: 0;
  clear: both;
  height: 0;
}
.flex-div img{
  max-width: 100%;
}
</style>
