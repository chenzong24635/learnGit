<template>
  <div style="background:#fff;padding:15px 30px;">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" >
      <FormItem   label="商品名称："  prop="goodsName">
        <Input class="goods-ipt" v-model="formValidate.goodsName" placeholder="请输入商品名称" />
      </FormItem>
      <FormItem class="inline" label="商品价格：" prop="goodsPrice">
        <Input class="goods-ipt" type="number" v-model="formValidate.goodsPrice" placeholder="请输入商品价格" />
      </FormItem>
      <FormItem class="inline" label="商品分类：" prop="gcID">
        <Select class="goods-ipt" v-model="model1"  @on-change="classEvent" style="width:160px">
          <Option v-for="item in fenList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem class="inline" label="商品单位：" prop="unit">
        <Input class="goods-ipt" v-model="formValidate.unit" placeholder="请输入商品单位" />
      </FormItem>
      <FormItem class="inline" label="库存预警：" prop="warningValue">
        <Input class="goods-ipt" type="number" v-model="formValidate.warningValue" placeholder="请输入库存预警值" />
      </FormItem>
      <br>
      <br>
      <FormItem label="商品详情：" prop="goodsDetails">
        <quill-editor
            v-model="formValidate.goodsDetails"
            ref="myQuillEditor"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          ></quill-editor>
      </FormItem>
      <FormItem>
        <Button type="primary" style="margin-bottom:30px" @click="update('formValidate')">修改商品信息</Button>
      </FormItem>
    </Form>

    <div>
      <div class="goods-img">
        <span  class="goodsname-left">主图(限一张)：</span>
        <div class="delBox" v-for="(item) in formValidate.dynamicPhotoList" :key="item.id" v-show="item.isMain===true">
          <img :src="item.photoUrl" v-if="item.isMain===true" />
        </div>
        <span style="color:#2d8cf0;cursor:pointer;margin-left:10px;" @click="modfiyMain(0)">新增</span>
      </div>
      <div class="goods-img">
        <span  class="goodsname-left">轮播图：</span>
        <div class="delBox" v-for="(item) in formValidate.dynamicPhotoList" :key="item.id" v-show="item.isMain===false">
          <img :src="item.photoUrl" v-if="item.isMain===false" />
          <Icon
            type="md-close-circle"
            class="del-icon"
            v-if="item.isMain===false"
            size="26"
            @click="delimg(item.id)"
          />
        </div>
        <span style="color:#2d8cf0;cursor:pointer;margin-left:10px;" @click="modfiyMain(2)">新增</span>
      </div>
    </div>

    <!--!-->
    <Modal v-model="modfiyImg" width="600" :footer-hide="true">
      <upload-img @imgList="imgList0" :isMultiple ="imgType ? true: false " :imgType="imgType" showImg></upload-img>
      <Button type="primary" class="check-style-model" @click="modfiyImgEvent">修改</Button>
    </Modal>
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
      model: '', //
      model1: '', // 当前分类
      fenList: [], // 商品分类
      id: '',
      token: '',
      mainImgId: '', //主图id， 用于上传新主图时删除旧的
      modfiyImg: false,
      imgType: 0, // 0为主图 1为轮播图
      reply: '',
      formValidate: {},
      ruleValidate: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
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
          { required: true, message: '请输入库存预警值'}
        ],
        goodsDetails: [
          { required: true, message: '请添加商品详情', trigger: 'blur' }
        ]
      },
      totalPage: 0,
      pingdata: [],
      pageIndex: 1,
      modfiyImgdata: '',
    }
  },
  watch:{
    "$route":function(to,from){ //路由id改变时刷新当前路由
      if (to.params.id !== from.params.id) {
        this.id = to.params.id
        this.lookInfor()
      }
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.token = sessionStorage.getItem('token')
    this.lookInfor()
    this.classList()
  },
  methods: {
    onEditorReady (editor) { // 准备编辑器
    },
    onEditorBlur () {}, // 失去焦点事件
    onEditorFocus () {}, // 获得焦点事件
    onEditorChange () {}, // 内容改变事件
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
    update(name) {
      let params = {
        gcID: this.formValidate.gcID,
        goodsDetails: this.formValidate.goodsDetails,
        goodsName: this.formValidate.goodsName,
        goodsPrice: this.formValidate.goodsPrice,
        goodsStatus: this.formValidate.goodsStatus,
        id: this.formValidate.id,
        sequence: this.formValidate.sequence,
        unit: this.formValidate.unit,
        warningValue: this.formValidate.warningValue
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.GLOBAL.Post('goods/update', params).then((res) => {
            if (res.status === 1) {
              this.$Message.success('修改成功');
            }else{
              this.$Message.error(res.result);
            }
          })
        } else {
            // this.$Message.error('Fail!');
        }
      })
    },
    classEvent (p) { // 分类选择
      this.formValidate.gcID = p
    },
    lookInfor () { // 商品详情
      this.GLOBAL.Get('goods/goodsDetails', {
        id: this.id,
        token: this.token
      }).then((res) => {
        this.formValidate = res.result
        this.model1 = res.result.gcID
        this.mainImgId = res.result.dynamicPhotoList.filter(item => {
          return item.isMain
        })[0].id || ''
      })
    },
    modfiyMain (type) { // 0为主图 1为轮播图
      this.imgType = type
      this.modfiyImg = true
    },
    imgList0 (p) { // 图片上图回调
      this.modfiyImgdata = p
    },
    modfiyImgEvent () { // 确认修改图片
      let that = this
      let params = {
        goodsID: this.id,
        photoList: this.modfiyImgdata
      }
      if(this.modfiyImgdata[0].isMain){ //如果为主图，删除之前的
        // that.delimg(this.mainImgId)
        this.updateBanner(this.modfiyImgdata[0])
        return
      }
      this.GLOBAL.Post('goods/addGoodsPhoto', params).then((res) => {
        if (res.status === 1) {
          that.lookInfor()
          that.$Message.success('' + res.result + '')
          that.modfiyImg = false
        } else {
          that.$Message.error('' + res.result + '')
        }
      })
    },
    updateBanner(obj){ //主图只能有一张，修改时更新
      let params = {
          id: this.mainImgId,
          isDetail: false,
          isMain: true,
          photoUrl: obj.photoUrl,
          sequence: 0
        }
      //POST /goods/updateGoodsPhoto
      // return 6D98FEB7-5B6D-411C-A6AD-00A0CDC13E2E"
      this.GLOBAL.Post('goods/updateGoodsPhoto', params).then((res) => {
        if (res.status === 1) {
          this.lookInfor()
          this.modfiyImg = false
          this.$Message.success(res.result + '')
        } else {
          this.$Message.error('' + res.result + '')
        }
      })
    },
    delimg (ids) { // 删除图片
      this.GLOBAL.Get('goods/deleteGoodsPhoto', { id: ids }).then((res) => {
        if (res.status === 1) {
          this.lookInfor()
          this.$Message.success('' + res.result + '')
        } else {
          this.$Message.error('' + res.result + '')
        }
      })
    }
  }
}
</script>
<style scoped>
div /deep/ .inline{display: inline-block;}
div /deep/ .ivu-form-item-label{font-size: 16px;}
.goodsname-style {
  color: #333;
  font-size: 16px;
  line-height: 40px;
  display: flex;
  align-items: center;
}
.goodsname-left{
  width: 120px;
}
.goodsname-style /deep/ img{
  max-width: 100%;
}
.goodsname-style span:not(:first-child) {
  color: #999;
  line-height: 1.5;
  display: block;
}
.goods-img {
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: flex-end;
  margin-top: 20px;
}
.goods-img img {
  width: 100px;
  height: 100px;
}
.evalImg {
  margin-right: 10px;
  display: inline-block;
}
.delBox {
  position: relative;
  margin-right: 20px;
}
.del-icon {
  position: absolute;
  top: -10px;
  right: -10px;
}
</style>
