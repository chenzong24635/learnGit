<template>
  <div>
    <div class="pageHeard">
      <Button type="primary" class="check-style" @click="remarkModel(0)">新增</Button>
    </div>

    <Modal v-model="xinzeng" width="400" :footer-hide="true">
      <div style="width:100%;height:40px;"></div>
      <div class="xinzeng-item">
        <label>分类名称</label>
        <Input v-model="name" placeholder="规格名称" style="width: 250px;margin-left:10px;" />
      </div>
      <div class="xinzeng-item">
        <label>排序值</label>
        <Input v-model="sequence" placeholder="排序值" style="width: 250px;margin-left:10px;" />
      </div>
      <div class="xinzeng-item">
        <label>是否显示</label>
        <RadioGroup v-model="single">
          <Radio label="是"></Radio>
          <Radio label="否"></Radio>
        </RadioGroup>
      </div>
      <Button type="primary" class="check-style-model" @click="addMode" v-if="addBtn==0">新增</Button>
      <Button type="primary" class="check-style-model" @click="modifyModel" v-else>修改</Button>
    </Modal>
    <Table :columns="columns1" :data="specdata" border></Table>
  </div>
</template>
<script>
import api from '@/libs/api'
export default {
  data () {
    return {
      xinzeng: false,
      addBtn: 0,
      name: '',
      sequence: '',
      single: '是',
      specID: '',
      calssID: '',
      columns1: [
        {
          title: '名称',
          key: 'className',
          align: 'center'
        },
        {
          title: '排序值',
          key: 'sequence',
          align: 'center'
        },
        {
          title: '添加时间',
          key: 'addTime',
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
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.name = params.row.className
                    this.sequence = params.row.sequence
                    this.single = params.row.display ? '是' : '否'
                    this.calssID = params.row.id
                    this.addBtn = 1
                    this.xinzeng = true
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                        title: '确认删除此分类？',
                        content: '<p>删除后该分类下的商品会一起删除</p>',
                        onOk: () => {
                          this.del(params.row.id)
                        },
                        onCancel: () => {
                        }
                    });
                  }
                }
              }, '删除')
            ]
            )
          }
        }
      ],
      specdata: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    del(id) {
      this.GLOBAL.Get('class/delete',{
        id,
        token: sessionStorage.getItem('token')
      }).then((res) => {
        if(res.status === 1){
          this.$Message.success(res.result);
          this.getList()
        }else{
          this.$Message.error(res.result);
        }
      })
    },
    remarkModel () { // 新增显示
      this.xinzeng = true
      this.addBtn = 0
      this.name = ''
      this.sequence = ''
    },
    addMode () { // 新增规格
      let params = {
        className: this.name,
        sequence: this.sequence,
        display: this.single === '是' ? 'true' : 'false',
        level: 1,
        parentID: '',
        icon: ''
      }
      if (this.name === '') {
        this.$Message.warning('请输入分类名称')
      }
      if (this.sequence === '') {
        this.$Message.warning('请输入排序值')
      }
      this.GLOBAL.Post('class/add', params).then((res) => {
        if (res.status === 1) {
          this.name = ''
          this.sequence = ''
          this.xinzeng = false
          this.getList()
          this.$Message.success('' + res.result + '')
        } else {
          this.$Message.error('' + res.result + '')
        }
      })
    },
    modifyModel () { // 修改规格排序值
      let params = {
        className: this.name,
        sequence: this.sequence,
        display: this.single === '是' ? 'true' : 'false',
        level: 0,
        parentID: '',
        icon: '',
        id: this.calssID
      }
      this.GLOBAL.Post('class/update', params).then((res) => {
        if (res.status === 1) {
          this.name = ''
          this.sequence = ''
          this.xinzeng = false
          this.getList()
          this.$Message.success('' + res.result + '')
        } else {
          this.$Message.error('' + res.result + '')
        }
      })
    },
    getList () { // 规格列表
      this.GLOBAL.Get('class/firstClass').then((res) => {
        this.specdata = res.result
      })
    }
  }
}
</script>
<style scoped>
.pageHeard {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  background: #fff;
  padding: 10px;
}
</style>
