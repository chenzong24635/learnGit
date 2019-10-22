<template>
  <div class="content">
    <h2>标题：</h2>
    <Input style="margin:10px 0 20px" v-model="result.title" placeholder="请输入公告标题" />
    <h2>内容：</h2>
    <quill-editor
      v-model="result.content"
      ref="myQuillEditor"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    ></quill-editor>
    <Button type="primary" style="margin:10px auto;display: block;" @click="update">{{type === 1 ? '修改' : '发布'}}</Button>
  </div>
</template>
<script>
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// import uploadImg from '_c/uploadImg'
Vue.use(VueQuillEditor)
export default {
  name: '',
  components: {},
  data () {
    return {
      type: 0, // 0: 发布，1:修改，
      result: {}
    }
  },
  watch:{
    "$route":function(to,from){ //路由id改变时刷新当前路由
      if (to.name !== from.name) {
        this.type = to.name === 'message1' ? 0 : 1
        if(this.type){
          this.get()
        }else{
          this.result = {
            content: '',
            title: ''
          }
        }
      }
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  created () {
    this.result = {}
    this.type = this.$route.name === 'message1' ? 0 : 1
    if(this.type){
      this.get()
    }
  },
  methods: {
    update() {
      if(this.result.title== ''){
        this.$Message.error('请添加标题');
        return
      }
      if(this.result.content== ''){
        this.$Message.error('请添加内容');
        return
      }
      let url = ''
      let params = {
        content: this.result.content,
        // id: this.result.id,
        title: this.result.title,
        token: sessionStorage.getItem('token')
      }
      if(this.type === 1) {
        params.id = this.result.id
        url = 'image/update/bulletin'
      }else{
        url = 'image/add/bulletin'
      }
      this.GLOBAL.Post(url, params).then((res) => {
        if(res.status === 1){
          this.$Message.success(res.result);
        }else{
          this.$Message.error(res.result);
        }
      })
    },
    get() {
      this.GLOBAL.Get('image/get/bulletin').then((res) => {
        if(res.status === 1){
          this.result = res.result
        }
      })
    },
    onEditorBlur () {}, // 失去焦点事件
    onEditorFocus () {}, // 获得焦点事件
    onEditorChange () {}, // 内容改变事件
  }
}
</script>
<style scoped lang="less">
.content{
  padding: 20px;
  background-color: #fff;
}
h2{
  margin-bottom: 10px;
}
</style>
