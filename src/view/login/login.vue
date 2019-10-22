<!--
 * @Description:
 * @version:
 * @Company: XuanMa
 * @Author: SnowBeatRain
 * @Date: 2019-07-22 10:14:03
 * @LastEditors: SnowBeatRain
 * @LastEditTime: 2019-08-15 13:49:30
 -->
<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import apis from '@/libs/api'
import CryptoJS from 'crypto-js/crypto-js'
import axios from 'axios'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ Name, Password }) {
      const _that = this
      let data = {
        mobile: Name,
        password: Password
      }
      if (data.Name === '') {
        this.$Message.warning('请输入账号')
        return
      }
      if (data.Password === '') {
        this.$Message.warning('请输入密码')
        return
      }
      apis.getLogin('admin/dynamicKey').then((res) => {
        if (res.status === 1) {
          apis.getLogin('admin/login', { mobile: Name, password: _that.Encrypt(Password, res.result.tokenKey), userKey: res.result.userKey }).then((res1) => {
            if (res1.status === 1) {
              sessionStorage.setItem('token', res1.result)
              axios.defaults.headers.common['token'] = res1.result
              this.$router.push({
                name: 'home'
              })
            } else {
              this.$Message.error(res1.result)
            }
          })
        } else {
          this.$Message.error(res.result)
        }
      })
    },
    Encrypt (word, keyStr) {
      var key = CryptoJS.enc.Utf8.parse(keyStr)
      var srcs = CryptoJS.enc.Utf8.parse(word)
      var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
      return encrypted.toString()
    }
  }
}
</script>

<style>

</style>
