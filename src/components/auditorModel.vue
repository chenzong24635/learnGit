<template>
   <div>
     <div class="account-all">
       <span>已选用户：</span>
       <div>
        <Tag   v-for="(item,index) in selectList" :key="index" @on-close="handleClose(item)" closable>{{item.name}}</Tag>
       </div>
     </div>
     <ul class="auditor-ul">
       <li v-for="(item,index) in adminList" :key="index" :class="index===activeIndex?'active-list':''" @click="changeEvent(index,item.AdminID)">
         <Icon type="ios-checkmark-circle"  size="18" v-if="index===activeIndex"/>
         <span>{{item.Name}}</span>
       </li>
     </ul>

   </div>
</template>
<script>
import api from '@/libs/api'
export default {
  props: {
    userid: '',
    selectList: Array
  },
  data () {
    return {
      adminList: [
        {
          Name: 'admin',
          AdminID: 0
        },
        {
          Name: '测试',
          AdminID: 0
        }, {
          Name: 'test',
          AdminID: 0
        }, {
          Name: '123',
          AdminID: 0
        }
      ],
      activeIndex: 0,
      uid: '',
      Type: '',
      showaccount: true
    }
  },
  watch: {
    userid (newValue, oldValue) {
      this.uid = newValue
    }
  },
  mounted () {
    this.uid = this.userid
  },
  methods: {
    handleClose (p) {
      // const oldList = this.selectList
      // this.selectList.splice(oldList.indexOf(p), 1)
      this.$emit('updata', p)
    },
    getPople (p, s) {
      this.Type = p
      // api.Get('BackUser/GetDistributableAdministrators', { type: p }).then((res) => {
      //   this.adminList = res.Result
      //   this.activeIndex = this.getIndex(this.adminList, s)
      // })
    },
    getIndex (obj, p) {
      let index = 0
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].Name === p) {
          index = i
        }
      }
      return index
    },
    changeEvent (p, s) {
      this.activeIndex = p
      let params = {
        adminid: s,
        userid: this.uid,
        type: this.Type
      }
      api.Get('BackUser/Distribution', params).then((res) => {
        if (res.Status === 1) {
          this.$emit('updata', res.Status)
        }
      })
    }
  }
}
</script>

<style scoped>
 ul,li{
   list-style: none
 }
.auditor-ul{
  margin-top:20px;
  overflow: hidden;
}
.auditor-ul li{
  float: left;
  padding:0 10px;
  height: 28px;
  border:1px solid #959595;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size:14px;
  margin-bottom:10px;
  margin-top:10px;
  cursor: pointer;
}
.auditor-ul  .active-list{
 border:1px solid #55a7fb !important;
 color:#55a7fb  !important
}
.auditor-ul li:nth-child(2n-1){
  margin-right: 20px;
}
.auditor-ul li:nth-child(2n){
  margin-left: 20px;
}
.auditor-ul li span{
  margin-left:5px;
}
</style>
