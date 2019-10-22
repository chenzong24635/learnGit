<template>
  <div>
    <div class="clearfix" style="margin-bottom:10px;">
      <div class="fl">
        <Input v-model="keyword" placeholder="关键字" style="width: 200px" @on-blur="KeywordEv"
        :clearable="true" @on-clear="clearText" search/>
        <Button type="primary" class=" check-style" @click="getList" style="margin-left:10px;">搜索</Button>
      </div>
      <Button type="primary" class="fr check-style" @click="showModal" style="margin-left:40px;">添加用户</Button>
    </div>

    <Table :columns="userTitle" :data="userList" border></Table>
<!-- <Table :columns="goodstitle" :data="goodsdata" border></Table> -->
    <Modal v-model="isShow" width="400" :footer-hide="true">
      <div style="width:100%;height:40px;"></div>
      <Form ref="formValidate" :model="formValidate" :label-width="80" :rules="ruleValidate">
        <FormItem label="用户名" prop="username">
            <Input v-model="formValidate.username" placeholder="请输入用户名" class="modal-list-ipt"  />
        </FormItem>
        <FormItem label="手机号码" prop="mobile">
          <Input v-model="formValidate.mobile" placeholder="请输入手机号码" class="modal-list-ipt"  />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="formValidate.password" placeholder="请输入密码" type="password" class="modal-list-ipt"  />
        </FormItem>
        <FormItem label="地址" prop="area">
          <Cascader
            :data="data"
            filterable
            @on-change="selectProvince"
            style="display:inline-block;" class="modal-list-ipt"
          ></Cascader>
        </FormItem>
        <FormItem label="详细地址" prop="areaInfo">
          <Input v-model="formValidate.areaInfo " placeholder="请输入详细地址" class="modal-list-ipt"  />
        </FormItem>
      </Form>
      <div class="btns">
          <Button @click="handleReset('formValidate')" style="margin-right: 20px">重置</Button>
          <Button type="primary"  @click="submit('formValidate')">确定</Button>
      </div>
    </Modal>
    <div class="page-style" v-if="totalCount!=0">
      <Page :total="totalCount" show-total :page-size="pageSize" @on-change="changePage" />
    </div>
  </div>
</template>
<script>
import md5 from 'js-md5'
import newAddress from '../../libs/addressData.json'
/**
 *@param {Array} address - 省市区
 *@param {Boolean} isShow - 添加新用户的模态框显示
 *@param {Object} formValidate - 添加新用户数据
*/
export default {
  data () {
    return {
      data: newAddress,
      keyword: '',
      userTitle: [
        {
          title: '用户名',
          key: 'userName',
          align: 'center'
        },
        {
          title: '头像',
          key: 'heardImg',
          align: 'center',
          render: (h, params) => {
            let heardImg = params.row.photoUrl.indexOf('http://') > -1 ? params.row.photoUrl : 'http://' + params.row.photoUrl
            return h('img',{
                attrs: {
                  src: heardImg
                },
                style: {
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'block',
                  margin: '5px auto'
                }
              })
          }
        },
        {
          title: '手机号码',
          key: 'mobile',
          align: 'center'
        },
        {
          title: '地址',
          key: 'address',
          align: 'center',
          render: (h, params) => {
            return h('p',[
              params.row.area,
              params.row.areaInfo
            ])
          }
        },
        {
          title: '注册时间',
          key: 'addTime',
          align: 'center'
        },
        {
          title: '操作',
          key: 'reset',
          align: 'center',
          width: '300',
          render: (h, params) => {
            return h('div',[
              h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style:{
                    margin: '0 3px'
                  },
                  on: {
                    click: () => {
                      this.getInfo(params.row.id)
                    }
                  }
              }, '查看月进货明细'),
              h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style:{
                    margin: '0 3px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '确定重置密码？',
                        content: '<p>重置后新密码为123456</p>',
                        onOk: () => {
                          this.changePsw(params.row.id)
                        },
                        onCancel: () => {}
                      })
                    }
                  }
              }, '重置密码'),
              h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style:{
                    margin: '0 3px'
                  },
                  on: {
                    click: () => {
                      this.del(params.row.id)
                    }
                  }
              }, '删除')
            ])
          }
        }
      ],
      userList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      token: '',
      isShow: false,
      formValidate: {
        area: '',
        areaInfo: '',
        mobile: '',
        password: '',
        username: '',
      },
      ruleValidate: {
        area: [
            { required: true, message: '请选择地区', trigger: 'blur' }
        ],
        areaInfo: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
        ],
        mobile: [
            { required: true, message: '请填写手机号', trigger: 'blur' },
            { type: 'string', min:11, max: 11, message: '请填写正确手机号', trigger: 'change' }
        ],
        password: [
            { required: true, message: '请填写密码', trigger: 'blur' }
        ],
        username: [
            { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
      }
    }
  },
  mounted () {
    this.getList()
    this.token = sessionStorage.getItem('token')
  },
  methods: {
    KeywordEv (val) {
    },
    clearText () {
      this.getList()
    },
    submit(name) {
      let _this = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formValidate.password = md5(this.formValidate.password)
          this.GLOBAL.Post('user/post/register', this.formValidate).then((res) => {
            if(res.status === 1){
              this.getList()
              this.isShow = false
              this.$Message.success(res.result);
            }else{
              this.$Message.error(res.result);
            }
          })
        } else {
          this.$Message.error('Fail!');
        }
      })
    },
    handleReset (name) {
        this.$refs[name].resetFields();
    },
    showModal() {
      this.isShow = true
      this.handleReset('formValidate')
    },
    selectProvince (p) { //省市区选择
      this.formValidate.area = p[0].split(',')[1] + p[1].split(',')[1] + p[2].split(',')[1]
    },
    getInfo(id){ //获取进货明细
      this.$router.push({name: 'orderList',params:{id:id}})
      /* let _this = this
      this.GLOBAL.Get('order/get/Info', {
        userId: id,
        token: this.token
      }).then((res) => {
        if(res.status === 1){
          // this.$Message.success(res.result);
        }else{
          this.$Message.error(res.result);
        }
      }) */
    },
    del(id){
      this.$Modal.confirm({
        title: '确认删除该用户？',
        onOk: () => {
          this.GLOBAL.Post('user/del', {
            idList: [
              id
            ],
            token: sessionStorage.getItem('token')
          }).then(res => {
            if(res.status === 1){
              this.getList()
              this.$Message.success('删除成功')
            }else{
              this.$Message.error(res.result)
            }
          })
        },
        onCancel: () => {
        }
      });
    },
    changePsw(id){
      let _this = this
      this.GLOBAL.Get('user/resetPassword', {
        userID: id,
        token: this.token
      }).then((res) => {
        if(res.status === 1){
          this.$Message.success('密码已重置');
        }else{
          this.$Message.error(res.result);
        }
      })
    },
    getList () {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.keyword
      }
      this.GLOBAL.Get('user/keyword', params).then((res) => {
        this.userList = res.result.list
        this.totalCount = res.result.totalRecord
      })
    },
    changePage (e) {
      this.pageIndex = e
      this.getList()
    }
  }
}
</script>
<style lang="less">
.btns{
  text-align: center;
}
.modal{
  &-list{
    &-ipt{
      width: 250px;
      margin-left: 10px;
    }
  }
}
</style>
