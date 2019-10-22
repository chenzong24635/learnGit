<template>
  <div class="user-bg">
    <div>
      <div class="flex-personnel">
        <div class="admin-box">
          <!-- <img src="../../../../assets/images/login-bg.jpg" width="60" height="60" class="mebment-logo"> -->
          <div class="admin-name">
            <p>admin 上午好！欢迎使用脸谱后台管理系统</p>
            <p><span>您上次登录时间：2019-6-17 13:00:00</span><span style="margin-left:15px;">地址：15.396.018</span><span style="margin-left:15px;">宁波市</span></p>
          </div>
        </div>
        <div class="personal-data">
          <div class="infor-btn">个人资料</div>
           <img src="../../../../assets/images/indeximgone.png">
        </div>
      </div>
    </div>

  </div>
</template>
<style scoped>
.mebment-logo{
  border-radius: 50%
}
.flex-personnel{
display: flex;align-items: center;justify-content: space-between;height:83px;
  padding:0 50px;
}
.user-bg{
 background:#fff;height:83px;margin:10px 35px 0 20px;border-radius:5px;
 -moz-box-shadow:0px 12px 8px -12px #c5c3c3; -webkit-box-shadow:0px 12px 8px -12px #c5c3c3; box-shadow:0px 12px 8px -12px #c5c3c3;
 z-index: 99;
}
.admin-box{
  display: flex;
  align-items: center;

}
.admin-box .admin-name{
  margin-left:15px;
}
.admin-box .admin-name p:first-child{
color:#778591;
font-size:16px;
}
.admin-box .admin-name p:last-child{
  margin-top:2px;
  font-size:14px;
  color:#a3acb6
}
.personal-data{
  display: flex;
  align-items: center
}
.personal-data div{
  border:1px solid #8ce0f9;
  color:#8ce0f9;
  font-size:14px;
  width: 68px;
  height:25px;
  text-align: center;
  border-radius: 5px;
  line-height:25px;
  margin-right: 20px;
  cursor: pointer;
}
</style>
