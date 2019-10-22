import CryptoJS from 'crypto-js/crypto-js'
 
// const KEY = CryptoJS.enc.Utf8.parse('Pkcs7'); // 'Pkcs7' 与后台一致
// const IV = CryptoJS.enc.Utf8.parse('Pkcs7'); // 'Pkcs7' 与后台一致

// AES加密 ：字符串 key iv  返回base64
 //加密方法
  export function Encrypt(word) {
      const key = CryptoJS.enc.Utf8.parse(sessionStorage.getItem('tokenKey'));  //十六位十六进制数作为密钥
       const iv = CryptoJS.enc.Utf8.parse(''); 
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        return encrypted.ciphertext.toString().toUpperCase();
}
 

