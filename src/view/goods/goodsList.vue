<template>
  <div >
    <!-- <router-link to="/test">test</router-link> -->
    <div class="pageHeard">
      <div>
        <Input
          v-model="keyword"
          placeholder="关键字"
          style="width: 150px"
          :clearable="true"
          @on-clear="getList"
          search
        />
        <Button
          type="primary"
          class="check-styles check-style"
          @click="getList"
          style="margin-left:10px;"
        >筛选</Button>
        <span style="margin-left:10px;font-size:14px;">商品类型：</span>
        <Select  style="width:200px" @on-change="ChangeList1" placeholder="全部">
          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span style="margin-left:10px;font-size:14px;">商品状态：</span>
        <Select style="width:200px" @on-change="ChangeList2" placeholder="全部">
          <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <Button type="primary" class="check-style" @click="gotoadd">新增</Button>
    </div>
    <Table :columns="goodstitle" :data="goodsdata" border></Table>
    <Modal v-model="xinzeng" width="400" :footer-hide="true">
      <div style="width:100%;height:40px;">
      </div>
      <div class="xinzeng-goods">
        <label>排序值</label>
        <Input v-model="sequence" type="number" placeholder="排序值" style="width: 250px;margin-left:10px;" />
      </div>
      <Button type="primary" class="check-style-model" @click="seqModel">确认</Button>
    </Modal>
    <div class="modal">
      <Modal v-model="goodsInforShow" width="700" :footer-hide="true">
        <div style="height:30px"></div>
        <div class="flex-div">
          <span class="goods-label">商品名称：</span>
          <Input v-model="goodsInfor.goodsName" placeholder="请输入商品名称" class="flex-div-ipt" />

        </div>
        <div class="flex-div">
          <span class="goods-label" >商品总库存：</span>
          <Input v-model="goodsInfor.goodsInventory" placeholder="请输入商品总库存" class="flex-div-ipt" />
        </div>
        <div class="flex-div">
          <span class="goods-label" >商品价格：</span>
          <Input v-model="goodsInfor.goodsPrice" placeholder="请输入商品价格" class="flex-div-ipt"/>
        </div>
        <div class="flex-div">
          <span class="goods-label">商品分类：</span>
          <Select v-model="goodsInfor.gcID" class="flex-div-ipt" @on-change="classEvent">
            <Option v-for="item in fenList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <!-- <div class="flex-div">
          <span class="goods-label">商品简介：</span>
          <Input
            v-model="goodsBriefs"
            placeholder="请输入商品简介"
            class="flex-div-ipt"
            type="textarea"
            autosize
          />
        </div> -->
        <div class="flex-div">
          <span class="goods-label">商品详情:</span>
          <!-- <div v-html="goodsDetails"></div> -->
          <Input
            v-model="goodsInfor.goodsDetails"
            placeholder="请输入商品详情"
            class="flex-div-ipt"
            type="textarea"
            autosize
          />
        </div>
        <Button
          type="primary"
          class="check-style"
          @click="saveGoods"
          style="margin:0 auto;display:block"
        >保存</Button>
      </Modal>
    </div>
    <Modal v-model="inventoryShow" width="400" :footer-hide="true">
      <p style="text-align:center;font-size:20px ">增加/减少当前库存值</p>
      <div style="width:100%;height:40px;"></div>
      <div class="xinzeng-goods">
        <label style="margin-right:10px">
          库存
        </label>
        <RadioGroup v-model="inventorySigin">
          <Radio :label="1">
              <span>+</span>
          </Radio>
          <Radio :label="0">
              <span>-</span>
          </Radio>
        </RadioGroup>
        <Input v-model="inventory" placeholder="请输入要增加/减少的数值" type="number" style="width: 250px;margin-left:10px;" />
      </div>
      <Button type="primary" class="check-style-model" @click="updateInventory">确认</Button>
    </Modal>
    <div class="page-style" v-if="totalPage!=0">
      <Page :total="totalPage" show-total :page-size="10" @on-change="changePage" />
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      xinzeng: false, // 修改排序值
      goodsInforShow: false, // 修改商品基本信息modal
      inventoryShow: false, // 修改库存modal
      sequence: '', // 排序值
      inventory: '', // 库存值
      inventorySigin: 1, // 库存符号
      name: '',
      goodsID: '',
      keyword: '',
      statusList: [
        {
          label: '全部商品',
          value: 0
        },
        {
          label: '推荐商品',
          value: 1
        }
      ],
      status: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '上架',
          value: 1
        },
        {
          label: '下架',
          value: 2
        }

      ],
      goodstitle: [
        {
          title: '推荐商品',
          key: 'goodsRecommend',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h('checkbox', {
              props: {
                value: params.row.goodsRecommend
              },
              on: {
                'on-change': () => {
                  this.changeStatue(params.row.goodsRecommend, params.row.id)
                }
              }
            })
          }
        },
        {
          title: '商品名称',
          key: 'goodsName',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                padding: '4px 0'
              },
              on: {
                click: () => {
                  // this.$router.push({name: 'lookgoods',  params: {id: params.row.id}})
                  // this.$router.push({name: 'updategoods',  params: {id: params.row.id}})
                }
              }
            }, params.row.goodsName)
          }
        },
        {
          title: '商品价格',
          key: 'goodsPrice',
          align: 'center',
        },
        {
          title: '库存',
          key: 'goodsInventory',
          align: 'center',
        },
        {
          title: '库存预警线',
          key: 'warningValue',
          align: 'center',
        },
        {
          title: '月销量',
          key: 'goodsSalenumM',
          align: 'center',
        },
        {
          title: '总销量',
          key: 'goodsSalenumT',
          align: 'center',
        },
        {
          title: '单位',
          key: 'unit',
          align: 'center',
          width: 80
        },
        {
          title: '排序值',
          key: 'sequence',
          align: 'center',
          width: 80,
          render: (h, params) => {
            let yy = params.row.sequence === null ? '设置排序值' : params.row.sequence
            return h('div', {
              style: {
                color: '#2d8cf0',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.xinzeng = true
                  this.goodsID = params.row.id
                }
              }
            }, yy)
          }
        },
        {
          title: '状态',
          key: 'goodsStatus',
          align: 'center',
          width: 110,
          render: (h, params) => {
            let ss = params.row.goodsStatus === 0 ? '正常出售' : '异常下架'
            let cc = params.row.goodsStatus === 0 ? '#19be6b' : '#ed4014'
            return h('div', {
              style: {
                color: cc
              }
            }, ss)
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'action',
          width: 300,
          render: (h, params) => {
            if (params.row.goodsStatus === 0) { // 0正常出售 1异常下架 ,
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
                      // this.goodsInforShow = true
                      // this.getInfor(params.row.id)
                      this.$router.push({name: 'lookgoods',  params: {id: params.row.id}})
                    }
                  }
                }, '修改商品信息'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: (ids) => {
                      this.inventoryShow = true
                      this.goodsID = params.row.id
                    }
                  }
                }, '修改库存'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.statusText = '下架'
                      this.goodShelves(params.row.id, 1)
                    }
                  }
                }, '下架')
              ])
            } else {
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
                      //  sessionStorage.setItem('goodsid',params.row.id)
                      // this.$router.push({ path: 'addgoods/' + params.row.id })
                      /* this.goodsInforShow = true
                      this.getInfor(params.row.id) */
                      this.$router.push({name: 'lookgoods',  params: {id: params.row.id}})
                    }
                  }
                }, '修改商品信息'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: (ids) => {
                      this.inventoryShow = true
                      this.goodsID = params.row.id

                    }
                  }
                }, '修改库存'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.statusText = '上架'
                      this.goodShelves(params.row.id, 0)
                    }
                  }
                }, '上架'),
              ]
              )
            }
          }
        }
      ],
      goodsdata: [],
      pageIndex: 1,
      statusText: '',
      goodsStatus: 0,
      isRecommend: 0,
      goodsInfor: {
        goodsName: '',
        goodsInventory: '',
        goodsPrice: '',
        goodsDetails: '',
        gcID: '',
      },
      fenList: [],
      totalPage: 0
    }
  },
  mounted () {
    this.getList()
    this.classList()
  },
  methods: {
    getList () {
      let params = {
        isRecommend: this.isRecommend,
        keyword: this.keyword,
        pageIndex: this.pageIndex,
        pageSize: 10,
        goodsStatus: this.goodsStatus
      }
      this.GLOBAL.Get('goods/search', params).then((res) => {
        this.goodsdata = res.result.list
        this.totalPage = res.result.totalRecord
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
        // this.specdata = res.result
      })
    },
    classEvent (p) { // 分类选择
      // this.gID = p
      this.goodsInfor.gcID = p
    },
    gotoadd () { // 新增
      this.$router.push({ name: 'addgoods' })
    },
    goodShelves (ids, ss) { // 商品上下架
      const that = this
      let params = {
        id: ids,
        status: ss
      }
      this.$Modal.confirm({
        title: '确定' + this.statusText + '？',
        content: '',
        onOk: () => {
          this.GLOBAL.Get('goods/removedShelves', params).then((res) => {
            if (res.status === 1) {
              that.getList()
              that.$Message.success('' + res.result + '')
            } else {
              that.$Message.error('' + res.result + '')
            }
          })
        },
        onCancel: () => {}
      })
    },
    seqModel () { // 设置修改排序值
      const that = this
      let params = {
        id: this.goodsID,
        sequence: this.sequence
      }
      if (this.sequence === '') {
        this.$Message.warning('请输入排序值')
        return
      }
      this.GLOBAL.Get('goods/sequence', params).then((res) => {
        if (res.status === 1) {
          this.xinzeng = false
          that.getList()
          that.$Message.success('' + res.result + '')
        } else {
          that.$Message.error('' + res.result + '')
        }
      })
    },
    ChangeList1 (p) { // 商品类型筛选
      this.isRecommend = p
      this.getList()
    },
    ChangeList2 (p) { // 商品状态筛选
      this.goodsStatus = p
      this.getList()
    },
    changeStatue (s, p) { // 更改推荐商品
      this.GLOBAL.Get('goods/recommend', { isRecommend: !s, id: p }).then((res) => {
        if (res.status === 1) {
          this.getList()
          this.$Message.success('' + res.result + '')
        } else {
          this.$Message.error('' + res.result + '')
        }
      })
    },
    getInfor (ids) { // 获取商品基本信息
      this.GLOBAL.Get('goods/goodsDetails', { id: ids }).then((res) => {
        if (res.status === 1) {
          this.goodsInfor = res.result
          // this.$Message.success(res.result)
        } else {
          this.$Message.error(res.result)
        }
      })
    },
    saveGoods () { // 保存 修改的商品信息
      this.GLOBAL.Post('goods/update', {
        gcID: this.goodsInfor.gcID,
        goodsDetails: this.goodsInfor.goodsDetails,
        goodsName: this.goodsInfor.goodsName,
        goodsPrice: this.goodsInfor.goodsPrice,
        goodsStatus: this.goodsInfor.goodsStatus,
        id: this.goodsInfor.id,
        sequence: this.goodsInfor.sequence,
        unit: this.goodsInfor.unit,
        warningValue: this.goodsInfor.warningValue
      }).then((res) => {
        if (res.status === 1) {
          this.$Message.success(res.result);
          this.goodsInforShow = false
          this.getList()
        }else{
          this.$Message.error(res.result);
        }
      })
    },
    updateInventory() {
      if(!this.inventory){
        this.$Message.info('请输入要修改的库存值')
        return
      }
      this.GLOBAL.Get('goods/updateInventory', {
        id: this.goodsID,
        number: this.inventorySigin ? this.inventory / 1 : -this.inventory,
        token: sessionStorage.getItem('token')
      }).then((res) => {
        if (res.status === 1) {
          this.inventoryShow = false
          this.inventory = ''
          this.getList()
          this.$Message.success(res.result)
        } else {
          this.$Message.error(res.result)
        }
      })
    },
    changePage (e) { // 分页切换
      this.pageIndex = e
      this.getList()
    }
  }
}
</script>
<style scoped>
.modal /deep/ .ivu-modal-body{
  padding: 20px;
}
.goods-label{
  width: 90px;
}
.pageHeard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 15px;
  background: #fff;
}
.xinzeng-goods {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.flex-div {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.flex-div img {
  max-width: 100%;
}
</style>
