<template>
   <div>
     <div class="flex-div" style="margin-bottom:0;margin-left:15px;">
                   <span class="goods-label">商品基础规格</span>
                  <Select v-model="model2" style="width:200px" @on-change="baseEvent">
                      <Option v-for="item in baseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <Select v-model="model3" style="width:200px;margin-left:10px;" @on-change="baseEvent2">
                      <Option v-for="item in baseTwo" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </div>
                       <div class="flex-div">
              <span>商品主图(有且只有一张主图)：</span>
              <upload-img @imgList="imgList" :imgType='0'></upload-img>
            </div>
                         <div class="flex-div">
                <span class="goods-label">商品价格</span>
                 <Input v-model="goodname" placeholder="请输入商品价格" style="width: 100px" />
                 <span class="goods-label" style="margin-left:50px;">VIP价格</span>
                  <Input v-model="goodname" placeholder="请输入VIP价格" style="width: 100px" />
            </div>
                 <div class="flex-div">
                 <span class="goods-label" style="margin-left:50px;">商品库存</span>
                  <Input v-model="goodname" placeholder="请输入商品库存" style="width: 100px" />
            </div>
       </div>
</template>
<script>
import uploadImg from '@/components/uploadImg'
export default {
  components: {
    uploadImg
  },
  data () {
    return {
      model2: '',
      model3: '',
      goodname: '',
      baseList: [],
      baseTwo: []
    }
  },
  mounted () {
    this.baseSpec()// 基础规格
  },
  methods: {
    baseSpec () {
      this.GLOBAL.Get('specification/get', {}).then((res) => {
        for (let i = 0; i < res.result.length; i++) {
          this.baseList.push({
            value: res.result[i].id + ',' + res.result[i].sequence,
            label: res.result[i].name
          })
        }
      })
    },
    baseChild (ids) {
      this.GLOBAL.Get('specification/specProperty/get', { specID: ids }).then((res) => {
        for (let i = 0; i < res.result.length; i++) {
          this.baseTwo.push({
            value: res.result[i].id + ',' + res.result[i].sequence,
            label: res.result[i].propertyValue
          })
        }
      })
    },
    baseEvent (p) { // 基础规格选择
      this.baseTwo = []
      let ids = p.split(',')
      this.baseChild(ids[0])
      this.goodsSpecs.push({
        sequence: ids[1],
        specID: ids[0]
      })
    },
    baseEvent2 (p) { // 基础规格选择
      let ids = p.split(',')
      this.goodsProperties.push({
        sequence: ids[1],
        specPropertyID: ids[0]
      })
    }
  }
}
</script>
