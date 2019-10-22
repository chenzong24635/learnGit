<template>
  <div>
    <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
      <img :src="item.photoUrl" />
      <div class="demo-upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
      </div>
      <Input v-model="item.sequence" placeholder="请输入图片排序值" style="width: 80px" />
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      name="image"
      :multiple="isMultiple"
      type="drag"
      action
      style="display: inline-block;width:58px;"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
      <img
        :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'"
        v-if="visible"
        style="width: 100%"
      />
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    isMultiple: {
      type: Boolean,
      default: true
    },
    imgType: Number, // 0为主图，1为banner图 2为详情图
    showImg: ''
  },
  data () {
    return {
      uploadList: [],
      visible: false,
      sequence: 0
    }
  },
  watch: {
    imgType () {
      this.uploadList = []
    }
  },
  mounted () {
    if (this.showImg !== '') {
      this.uploadList.push({
        photoUrl: this.showImg,
        isDetail: false,
        isMain: true,
        sequence: 0
      })
    }
    // this.uploadList = this.$refs.upload.fileList
  },
  methods: {
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.uploadList
      this.uploadList.splice(fileList.indexOf(file), 1)
      this.$emit('imgList', this.uploadList)
    },
    handleSuccess (res, file) {
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: '文件 ' + file.name + ' 格式错误, 请选择 jpg 或 png格式.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: '文件 ' + file.name + ' 太大, 不能超过 2M.'
      })
    },
    handleBeforeUpload (file) {
      const that = this
      if (that.imgType === 0) {
        if (that.uploadList.length >= 1) {
          this.$Message.warning('商品主图有且只能为1张,如需更改请删除后再上传')
          return
        }
      }
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = e => {
        let _file = e.target.result
        this.GLOBAL.Post('image/post', { image: _file }).then((res) => {
          if (that.imgType === 0) { // 主图
            this.uploadList.push({
              photoUrl: res.result,
              isDetail: false,
              isMain: true,
              sequence: 0
            })
          } else if (that.imgType === 1) { // 轮播图和商品详情图
            this.uploadList.push({
              photoUrl: res.result,
              isDetail: true,
              isMain: false,
              sequence: 0
            })
          } else if (that.imgType === 2) { // 修改商品页面 上传 轮播图
            this.uploadList.push({
              photoUrl: res.result,
              isDetail: false,
              isMain: false,
              sequence: 0
            })
          }

          this.$emit('imgList', this.uploadList)
        })
      }
      return false //
    }
  }
}
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
