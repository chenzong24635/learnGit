<template>
  <div>

    <div style="margin-bottom:10px;">
      <Input
        v-model="keyword"
        placeholder="关键字"
        style="width: 200px"
        @on-blur="KeywordEv"
        :clearable="true"
        @on-clear="clearText"
        search
      />
      <Button type="primary" class="check-style" @click="getList" style="margin-left:10px;">搜索</Button>
      <Button type="info" ghost class="check-style" style="float:right" @click="addAdmin">添加</Button>
    </div>
    <Table :columns="adminTitle" :data="adminList" border>
      <template slot-scope="{row}" slot="action">
        <!-- <Button type="warning" size="small" style="margin-right: 8px" @click="showPwdModal(row)">修改密码</Button> -->
        <Button type="warning" size="small" style="margin-right: 8px" @click="reset(row)">重置密码</Button>
        <Button type="error" size="small" @click="del(row)">删除</Button>
      </template>
    </Table>
    <div class="page-style" v-if="totalCount!=0">
      <Page :total="totalCount" show-total :page-size="pageSize" @on-change="changePage" />
    </div>

    <!-- 添加/编辑管理员 -->
    <Modal
      v-model="showModel"
      :title="modelTitle"
      :mask-closable="false"
      width="360"
      @on-ok="submitForm('addForm')"
      @on-cancel="cancelModal"
    >
      <Form ref="addForm" :model="addForm" :rules="addFormRules" :label-width="70">
        <FormItem label="姓名：" prop="username">
          <Input v-model="addForm.username" placeholder="请输入管理员姓名" />
        </FormItem>
        <FormItem label="手机号：" prop="mobile">
          <Input v-model="addForm.mobile" placeholder="请输入管理员手机号" />
        </FormItem>
        <FormItem label="密码：" prop="password" v-if="!isEdit">
          <Input v-model="addForm.password" :type="pwdInputType" placeholder="请设置账号密码">
            <Icon :type="pwdInputIcon" slot="suffix" @click.native="changePwdType" />
          </Input>
        </FormItem>
        <template v-if="isEdit">
          <FormItem label="性别：" prop="sex">
            <RadioGroup v-model="addForm.sex">
              <Radio label="0">女</Radio>
              <Radio label="1">男</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="头像:" prop="photoUrl">
            <div class="img-con" style="position: relative;width: 120px;height:120px;">
              <img
                v-if="addForm.photoUrl"
                :src="addForm.photoUrl"
                alt
                style="width: 120px;height:120px;position: absolute;top:0;border:1px dashed #dcdee2;"
              />
              <Upload
                :class="{'tran-upload': addForm.photoUrl}"
                ref="upload"
                :show-upload-list="false"
                :format="['jpg','jpeg','png']"
                :on-format-error="handleFormatError"
                :before-upload="handleBeforeUpload"
                type="drag"
                action
                style="display: inline-block;width:120px;position: absolute;top:0;"
              >
                <div style="width: 120px;height:120px;line-height: 120px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </div>
          </FormItem>
        </template>
      </Form>
    </Modal>


    <!-- 修改密码 -->
    <Modal
      v-model="showPwdModel"
      title="修改密码"
      :mask-closable="false"
      width="360"
      @on-ok="submitPwd('pwdForm')"
      @on-cancel="cancelPwd"
    >
      <Form ref="pwdForm" :model="pwdForm" :rules="pwdFormRules" :label-width="70">
        <FormItem label="手机号：" prop="mobile">
          <Input v-model="pwdForm.mobile" placeholder="请输入管理员手机号" readonly />
        </FormItem>
        <FormItem label="旧密码：" prop="oldPassword">
          <Input v-model="pwdForm.oldPassword" :type="oldInputType" placeholder="请输入原始密码">
            <Icon :type="oldInputIcon" slot="suffix" @click.native="changeOldPwdType" />
          </Input>
        </FormItem>
        <FormItem label="新密码：" prop="newPassword">
          <Input v-model="pwdForm.newPassword" :type="newInputType" placeholder="请设置新密码">
            <Icon :type="newInputIcon" slot="suffix" @click.native="changeNewPwdType" />
          </Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import md5 from 'js-md5'
export default {
  data () {
    const validatorPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入管理员手机号'))
      } else if (!/^1[345789]\d{9}$/.test(value)) {
        callback(new Error('请输入有效的手机号'))
      } else {
        callback()
      }
    }
    const validatePhoto = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请上传头像'))
      } else {
        callback()
      }
    }
    return {
      keyword: '',
      adminTitle: [
        {
          title: '名称',
          key: 'userName',
          align: 'center'
        },
        {
          title: '手机号码',
          key: 'mobile',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'addTime',
          align: 'center'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          // fixed: 'right',
          width: 200
        }
      ],
      adminList: [],
      roleTitle: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '角色名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '描述',
          key: 'describe',
          align: 'center',
          render: (h, params) => {
            return h('span', {}, params.row.describe ? params.row.describe : '-')
          }
        }
      ],
      roleList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      showModel: false,
      roleLoading: false,
      showRoleModel: false,
      showPwdModel: false,
      adminId: '',
      adminRowId: [],
      isEdit: false,
      modelTitle: '添加管理员',
      showPwd: false,
      showOldPwd: false,
      showNewPwd: false,
      addForm: {
        username: '',
        mobile: '',
        password: '',
        sex: '',
        photoUrl: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validatorPhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请设置账号密码', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        photoUrl: [
          { required: true, validator: validatePhoto }
        ]
      },
      pwdForm: {
        mobile: '',
        oldPassword: '',
        newPassword: ''
      },
      pwdFormRules: {
        mobile: [
          { required: true, validator: validatorPhone, trigger: 'blur' }
        ],
        oldPassword: [
          { required: true, message: '请输入原始密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请设置新密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getList()
  },
  computed: {
    pwdInputType () {
      return this.showPwd ? 'text' : 'password'
    },
    oldInputType () {
      return this.showOldPwd ? 'text' : 'password'
    },
    newInputType () {
      return this.showNewPwd ? 'text' : 'password'
    },
    pwdInputIcon () {
      return this.showPwd ? 'ios-eye-outline' : 'ios-eye-off-outline'
    },
    oldInputIcon () {
      return this.showOldPwd ? 'ios-eye-outline' : 'ios-eye-off-outline'
    },
    newInputIcon () {
      return this.showNewPwd ? 'ios-eye-outline' : 'ios-eye-off-outline'
    }
  },
  methods: {
    reset(item){
      this.$Modal.confirm({
          title: '是否重置密码',
          content: '<p>重置后新密码为123456</p>',
          onOk: () => {
            this.GLOBAL.Get('admin/password/reset', {
              userId: item.id,
              token: sessionStorage.getItem('token')
            }).then(res => {
              if(res.status === 1){
                this.getList()
                this.$Message.success('密码已重置')
              }else{
                this.$Message.info(res.result);
              }
            })
          },
          onCancel: () => {
          }
      })
    },
    del(row){
      this.$Modal.confirm({
          title: '确认删除该管理员？',
          onOk: () => {
            this.GLOBAL.Post('admin/del', {
              // adminIdList: {idList:[row.id]},
              idList: [
                  row.id
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
    submitRoleId () {
      this.GLOBAL.Post('admin/role/update', this.adminRowId).then(res => {
        this.$Message.success('配置成功')
      })
    },
    changeSelection (selects) {
      this.adminRowId = []
      selects.forEach(item => {
        var obj = {
          roleID: item.id,
          userID: this.adminId
        }
        this.adminRowId.push(obj)
      })
    },

    getAllRoles () {
      return new Promise((resolve, reject) => {
        this.GLOBAL.Get('roles/all').then(res => {
          this.roleLoading = false
          this.roleList = res.result
          if (this.adminRowId.length > 0) {
            for (var i = 0; i < this.adminRowId.length; i++) {
              for (var j = 0; j < this.roleList.length; j++) {
                if (this.roleList[j].id === this.adminRowId[i].roleID) {
                  this.roleList[j]._checked = true
                }
              }
            }
          } else {
            this.roleList.forEach(item => {
              delete item._checked
            })
          }
          resolve(res)
        })
      })
    },
    addAdmin () {
      this.modelTitle = '添加管理员'
      this.isEdit = false
      this.showModel = true
    },
/*     edit (row) {
      this.addForm.username = row.userName
      this.addForm.mobile = row.mobile
      this.addForm.id = row.id
      this.addForm.sex = '' + row.sex
      this.addForm.photoUrl = row.photoUrl.indexOf('http://') > -1 ? row.photoUrl : 'http://' + row.photoUrl
      this.modelTitle = '编辑管理员信息'
      this.isEdit = true
      this.showModel = true
    }, */
    submitForm (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          var params = JSON.parse(JSON.stringify(this.addForm))
          var url = 'admin/register'

          if (this.isEdit) {
            delete params.password
            params.sex = Number(params.sex)
            url = 'admin/update'
          } else {
            params.password = md5(params.password)
            delete params.photoUrl
            delete params.sex
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
            this.showModel = true
          })
        }
      })
    },
    cancelModal () {
      this.resetForm()
    },
    resetForm () {
      this.$refs.addForm.resetFields()
      this.addForm = {
        username: '',
        mobile: '',
        password: '',
        sex: '',
        photoUrl: ''
      }
    },
    showPwdModal (row) {
      this.pwdForm.mobile = row.mobile
      this.showPwdModel = true
    },
    submitPwd (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          var params = JSON.parse(JSON.stringify(this.pwdForm))
          params.oldPassword = md5(params.oldPassword)
          params.newPassword = md5(params.newPassword)
          var url = 'admin/password/update'
          this.GLOBAL.Get(url, params).then((res) => {
            if (res.status === 1) {
              this.$Message.success(res.result)
              this.getList()
              this.resetPwd()
            } else {
              this.$Message.warning(res.result)
              this.$nextTick(() => {
                this.showPwdModel = true
              })
            }
          })
        } else {
          this.$nextTick(() => {
            this.showPwdModel = true
          })
        }
      })
    },
    cancelPwd () {
      this.resetPwd()
    },
    resetPwd () {
      this.$refs.pwdForm.resetFields()
      this.pwdForm = {
        mobile: '',
        oldPassword: '',
        newPassword: ''
      }
    },
    changePwdType () {
      this.showPwd = !this.showPwd
    },
    changeOldPwdType () {
      this.showOldPwd = !this.showOldPwd
    },
    changeNewPwdType () {
      this.showNewPwd = !this.showNewPwd
    },
    KeywordEv () {},
    clearText () {
      this.getList()
    },
    getList () {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.keyword
      }
      this.GLOBAL.Get('admin/keyword', params).then(res => {
        this.adminList = res.result.list
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
<style scoped>
.ivu-form-item-error /deep/ .ivu-upload-drag {
  border-color: #ed4014;
}
.tran-upload {
  opacity: 0;
}

.ivu-select-item {
  white-space: pre-wrap;
}

/deep/.ivu-modal-body {
  max-height: 100px;
}
</style>
