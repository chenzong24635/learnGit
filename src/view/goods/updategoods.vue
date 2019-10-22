<template>
  <div style="background:#fff;overflow:hidden;padding:30px;">
    <!-- <router-link to="/upload" >/upload</router-link> -->
    <div class="page-title-add">修改商品</div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" inline>
      <FormItem label="商品名称："  prop="goodsName">
        <Input class="goods-ipt" v-model="formValidate.goodsName" placeholder="请输入商品名称" />
      </FormItem>
      <FormItem label="商品总库存：" prop="goodsInventory">
        <Input class="goods-ipt" type="number" v-model="formValidate.goodsInventory" placeholder="请输入商品总库存" />
      </FormItem>
      <FormItem label="商品价格：" prop="goodsPrice">
        <Input class="goods-ipt" type="number" v-model="formValidate.goodsPrice" placeholder="请输入商品价格" />
      </FormItem>
      <FormItem label="商品分类：" prop="gcID">
        <Select class="goods-ipt" v-model="model1"  @on-change="classEvent">
          <Option v-for="item in fenList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="商品单位：" prop="unit">
        <Input class="goods-ipt" v-model="formValidate.unit" placeholder="请输入商品单位" />
      </FormItem>
      <FormItem label="库存预警：" prop="warningValue">
        <Input class="goods-ipt" type="number" v-model="formValidate.warningValue" placeholder="请输入库存预警值" />
      </FormItem>
      <br>
      <FormItem label="商品主图(有且只能有一张)" align="center" prop="mainImg">
        <upload-img @imgList="imgListMain" :imgType="0" showImg></upload-img>
      </FormItem>
      <br>
      <FormItem label="商品详情：" prop="content">
        <quill-editor
          v-model="formValidate.content"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
        ></quill-editor>
      </FormItem>
      <br>
      <FormItem label="商品轮播图：" prop="banerImg">
        <upload-img @imgList="imgListBanner" :imgType="1" showImg></upload-img>
      </FormItem>
      <br>
      <FormItem>
        <Button type="primary" style="margin-left:100px;width:100px;" @click="addGoods('formValidate')">修改商品</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import uploadImg from '_c/uploadImg'
Vue.use(VueQuillEditor)
export default {
  components: {
    uploadImg
  },
  data () {
    return {
      id: '',
      formValidate: {
        gcID: '',
        goodsInventory: '',
        goodsName: '',
        goodsPrice: '',
        goodsStatus: 1,
        photoList: [],
        mainImg: '',
        content: '',
        banerImg: '',
        unit: '',
        warningValue: '',
      },
      ruleValidate: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goodsInventory: [
          { required: true, message: '请输入商品总库存' }
        ],
        goodsPrice: [
          { required: true, message: '请输入商品价格' }
        ],
        gcID: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
        unit: [
          { required: true, message: '请输入商品单位', trigger: 'blur' },
        ],
        warningValue: [
          { required: true, message: '请输入库存预警值' }
        ],
        /* mainImg: [
          { required: true, type: 'array', max: 1, message: '请添加商品主图'}
        ], */
        content: [
          { required: true, message: '请添加商品详情', trigger: 'blur' }
        ],
        /* banerImg: [
          { required: true, type: 'array', message: '请添加商品轮播图'}
        ] */
      },
      content: '',
      editorOption: {},
      model1: '',
      showSpec: false,
      fenList: [] // 商品分类
    }
  },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.classList()
    this.getInfor(this.id)
  },
  methods: {
    onEditorReady (editor) { // 准备编辑器
    },
    onEditorBlur () {}, // 失去焦点事件
    onEditorFocus () {}, // 获得焦点事件
    onEditorChange () {}, // 内容改变事件
    saveHtml: function (event) {
    },
    getInfor (ids) { // 获取商品基本信息
      this.GLOBAL.Get('goods/goodsDetails', { id: ids }).then((res) => {
        if (res.status === 1) {
          this.formValidate = res.result
          this.model1 = res.result.gcID // 商品分类
          this.formValidate.content = res.result.goodsDetails // 商品详情
          //商品主图
          this.formValidate.mainImg = res.result.dynamicPhotoList.filter(item => {
            if(item.isMain){
              this.imgListMain(item)
            }
            return item.isMain
          })[0].photoUrl
          //商品轮播图
          this.formValidate.banerImg = res.result.dynamicPhotoList.filter(item => {
            if(item.isDetail){
              this.imgListBanner(item)
            }
            return item.isDetail
          })
        } else {
          this.$Message.error(res.result)
        }
      })
    },
    classList () { // 分类
      this.GLOBAL.Get('class/firstClass').then((res) => {
        for (let i = 0; i < res.result.length; i++) {
          this.fenList.push({
            value: res.result[i].id,
            label: res.result[i].className
          })
        }
      })
    },
    classEvent (p) { // 分类选择
      this.formValidate.gcID = p
    },
    addGoods (name) { // 创建商品返回goodsid
      let params = {
        id: this.id,
        gcID: this.formValidate.gcID,
        goodsDetails: this.formValidate.content,
        goodsInventory: this.formValidate.goodsInventory / 1,
        goodsName: this.formValidate.goodsName,
        goodsPrice: this.formValidate.goodsPrice / 1,
        goodsStatus: 1,
        photoList: [...this.formValidate.mainImg, ...this.formValidate.banerImg],
        unit: this.formValidate.unit,
        warningValue: this.formValidate.warningValue
      }
      this.$refs[name].validate((valid) => {
        if (valid) {

          this.GLOBAL.Post('goods/add', params).then((res) => {
            if (res.status === 1) {
              // sessionStorage.setItem('goodsid', res.result)
              this.$Message.success(res.result);
              // sessionStorage.setItem('goodsname', this.goodname)
              // this.$router.push({ name: 'addSpec' })
            }else{
              this.$Message.error(res.result);
            }
          })
        } else {
            // this.$Message.error('Fail!');
        }
      })
    },
    imgList (p) { // 上传图片后子组件传递过来的数据
    },
    imgListBanner (p) { // 商品轮播图
      this.formValidate.banerImg = p
    },
    imgListMain (p) { // 商品主图
      this.formValidate.mainImg = p
    }

  }
}
</script>
<style scoped>
.goods-label{
  display: inline-block;
  width: 90px;
}
.goods-ipt{
  width: 200px;
}
.pageHeard {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.left-part {
  padding-left: 30px;
  margin-top: 15px;
}
.addSpecBox {
  width: 150px;
  height: 50px;
  border: 1px dashed #dcdee2;
  line-height: 50px;
  margin-left: 30px;
  text-align: center;
}
.addSpecBox:hover {
  border: 1px dashed #2d8cf0;
  color: #2d8cf0;
}

.page-title-add {
  font-size: 18px;
  font-weight: bold;
  color: #f44;
  border-left: 2px solid #f44;
  padding-left: 15px;
  margin-bottom: 20px;
}
.goods-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  margin-bottom: 20px;
  padding: 10px 0;
}
.goods-title .name {
  font-size: 16px;
  color: #333;
  padding-left: 30px;
}
.goods-label {
  margin-right: 6px;
  font-size: 14px;
}
.xinzeng-goods {
  margin-bottom: 10px;
}
.flex-div {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
</style>
