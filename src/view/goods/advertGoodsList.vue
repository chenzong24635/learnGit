<template>
  <div>
      <div class="pageHeard">
        <div>
        </div>
        <Button type="primary" class="check-style" @click="gotoadd">新增</Button>
    </div>
      <Table :columns="goodstitle" :data="goodsdata" border></Table>
      <div class="page-style" v-if="totalPage!=0">
        <Page :total="totalPage" show-total  :page-size='10'  @on-change="changePage"/>
      </div>
      <Modal
          v-model="modal1"
          title="新增广告位商品"
          width="360"
          :mask-closable="false"
          @on-ok="ok('advertInfo')"
          @on-cancel="cancel('advertInfo')">
          <Form ref="advertInfo" :model="advertInfo" :rules="advertRules" inline>
            <div class="modal-item">
              <p class="item-title">商品名：</p>
              <div class="item-content">
                <FormItem label="" prop="goodsID">
                  <Select
                      v-model="advertInfo.goodsID"
                      :disabled="isEdit"
                      placeholder="搜素并选择商品"
                      filterable
                      remote
                      :remote-method="getGoodsList"
                      :loading="selectLoading">
                      <Option v-for="(select, index) in selectList" :value="select.id" :key="index">{{select.goodsName}}</Option>
                  </Select>
                </FormItem>
              </div>
            </div>
            <div class="modal-item">
              <p class="item-title">排序值：</p>
              <div class="item-content">
                <FormItem label="">
                  <InputNumber :min="1" v-model="advertInfo.sequence"></InputNumber>
                </FormItem>
              </div>
            </div>
            <div class="modal-item" style="align-items: flex-start;">
              <p class="item-title">商品图：</p>
              <div class="item-content">
                <FormItem label="" prop="adPhotoURL">
                  <div class="img-con" style="position: relative;width: 120px;height:120px;">
                    <img v-if="advertInfo.adPhotoURL" :src="advertInfo.adPhotoURL" alt="" style="width: 120px;height:120px;position: absolute;top:0;border:1px dashed #dcdee2;">
                    <Upload
                        :class="{'tran-upload': advertInfo.adPhotoURL}"
                        ref="upload"
                        :show-upload-list="false"
                        :format="['jpg','jpeg','png']"
                        :on-format-error="handleFormatError"
                        :before-upload="handleBeforeUpload"
                        type="drag"
                        action=""
                        style="display: inline-block;width:120px;position: absolute;top:0;">
                        <div style="width: 120px;height:120px;line-height: 120px;">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                  </div>
                </FormItem>
              </div>
            </div>
          </Form>
      </Modal>
  </div>
</template>
<script>
export default {
  data () {
    const validatePhoto = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请上传商品图'))
      } else {
        callback()
      }
    }
    return {
      isEdit: false,
      modal1: false,
      selectLoading: false,
      selectList: [],
      goodstitle: [
        {
          title: '商品图',
          key: 'adPhotoURL',
          align: 'center',
          render: (h, params) => {
            let adPhotoURL = params.row.adPhotoURL.indexOf('http://') > -1 ? params.row.adPhotoURL : 'http://' + params.row.adPhotoURL
            return h('div', [
              h('img', {
                attrs: {
                  src: adPhotoURL
                },
                style: {
                  width: '100px',
                  height: '100px',
                  marginTop: '5px'
                }
              })
            ])
          }
        },
        {
          title: '商品名称',
          key: 'goodsName',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                color: '#2d8cf0'
              },
              class: 'line-clamp',
              on: {
                click: () => {
                  sessionStorage.setItem('lookID', params.row.id)
                  this.$router.push({ name: 'lookgoods' })
                }
              }
            }, params.row.goodsName)
          }
        },
        {
          title: '排序值',
          key: 'sequence',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.advertInfo = {
                      goodsID: params.row.goodsID,
                      adPhotoURL: params.row.adPhotoURL,
                      sequence: params.row.sequence,
                      advertID: params.row.advertID
                    }
                    this.selectList = [{
                      id: params.row.goodsID,
                      goodsName: params.row.goodsName
                    }]
                    this.isEdit = true
                    this.modal1 = true
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginLeft: '10px'
                },
                on: {
                  click: () => {
                    this.deleteAdvert(params.row.advertID)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      goodsdata: [],
      uploadList: [],
      pageIndex: 1,
      totalPage: 0,
      advertInfo: {
        adPhotoURL: '',
        goodsID: '',
        sequence: 1
      },
      advertRules: {
        adPhotoURL: [
          { validator: validatePhoto, message: '请上传商品图' }
        ],
        goodsID: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {

    getList () {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: 10
      }
      this.GLOBAL.Get('banner/get', params).then((res) => {
        this.goodsdata = res.result.list
        this.totalPage = res.result.totalRecord
      })
    },
    getGoodsList (query) { //  广告位商品搜索
      let params = {
        pageIndex: 1,
        pageSize: 9999,
        keyword: query.replace(/\s*/g, '')
      }
      this.GLOBAL.Get('banner/search', params).then((res) => {
        this.selectList = res.result.list
      })
    },
    gotoadd () { // 新增广告位商品
      this.modal1 = true
    },
    ok (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          var params = this.advertInfo
          var url = 'banner/add'

          if (this.isEdit) {
            url = 'banner/update'
            delete params.goodsID
            this.GLOBAL.Get(url, params).then((res) => {
              if (res.status === 1) {
                this.$Message.success(res.result)
                this.getList()
                this.resetForm()
              } else {
                this.$Message.warning(res.result)
                this.$nextTick(() => {
                  this.modal1 = true
                })
              }
            })
            return
          }
          this.GLOBAL.Post(url, params).then((res) => {
            if (res.status === 1) {
              this.$Message.success(res.result)
              this.getList()
              this.resetForm()
            } else {
              this.$Message.warning(res.result)
              this.$nextTick(() => {
                this.modal1 = true
              })
            }
          })
        } else {
          this.$nextTick(() => {
            this.modal1 = true
          })
        }
      })
    },
    cancel (name) {
      this.resetForm()
      this.modal1 = false
    },
    resetForm () {
      this.$refs.advertInfo.resetFields()
      this.$nextTick(() => {
        this.isEdit = false
        this.advertInfo = {
          adPhotoURL: '',
          goodsID: '',
          sequence: 1
        }
      })
    },
    //  上传图片
    handleBeforeUpload (file) { // 文件上传前
      if (file.type.indexOf('image') < 0) {
        this.$Message.warning('请上传正确的图片格式！')
        return
      }
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        this.GLOBAL.Post('image/post', {
          image: e.target.result
        }).then((res) => {
          if (res.status === 1) {
            this.advertInfo.adPhotoURL = res.result
            this.$refs.advertInfo.validateField('adPhotoURL')
          }
        })
      }
    },
    handleFormatError (file) { // 格式验证失败
    },
    deleteAdvert (id) { // 商品上下架
      const that = this
      this.$Modal.confirm({
        title: '确定删除该商品吗？',
        content: '',
        onOk: () => {
          this.GLOBAL.Get('banner/delete', {
            advertID: id
          }).then((res) => {
            if (res.status === 1) {
              that.getList()
              that.$Message.success(res.result)
            } else {
              that.$Message.error(res.result)
            }
          })
        },
        onCancel: () => {}
      })
    },
    changePage (e) { // 分页切换
      this.pageIndex = e
      this.getList()
    }
  },
  watch: {
  }
}
</script>
<style scoped>
.pageHeard{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom:10px;
  padding:15px;
  background: #fff
}
.xinzeng-goods{
  display: flex;
  align-items: center;
  margin-bottom:10px;
}
.flex-div{
  display: flex;
  align-items: center;
  margin-bottom:15px;
}

.modal-item {
  display: flex;
  align-items: center;
}
.modal-item + .modal-item {
  margin-top: 30px;
}

.item-content {
  flex: 1;
}

.item-content .ivu-form-item {
  margin: 0;
  vertical-align: unset;
  width: 100%;
}
.ivu-form-item-error /deep/ .ivu-upload-drag {
  border-color: #ed4014;
}
.tran-upload {
  opacity: 0;
}

.ivu-select-item {
  white-space: pre-wrap;
}
</style>
