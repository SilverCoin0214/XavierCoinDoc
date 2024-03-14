/*
 * @Author: Zzx_Xavier zhangzuoxuan@gmail.com
 * @Date: 2024-03-12 15:46:26
 * @LastEditors: Zzx_Xavier zhangzuoxuan@gmail.com
 * @LastEditTime: 2024-03-13 17:05:58
 * @FilePath: /lodash/myLodash.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const _ = {

  /* 字符串类 ------------------------------------------------------------------------*/
  // 1. 转字符串为驼峰写法
  camelCase: (str) => {
    let res = ''
    let flag = false
    // 遍历, 全小写
    for (let i = 0; i < str.length; i++) {
      if (_.isLetter(str[i])) {
        if (flag) {
          res += str[i].toUpperCase()
        } else {
          res += str[i].toLowerCase()
        }
        flag = false
      } else {
        flag = true
      }
    }

    return res.charAt(0).toLowerCase() + res.slice(1)
  },
  isLetter: (char) => {
    return /^[a-zA-Z]$/.test(char);
  },
  // lodash源码
  // camelCase_: createCompounder(function (result, word, index) {
  //   word = word.toLowerCase()
  //   return result + (index ? capitalize(word) : word)
  // }),

  // 2.转换字符串string首字母为大写，剩下为小写。
  capitalize: (str) => {
    let res = ''
    for (let i = 0; i < str.length; i++) {
      res += str[i].toLowerCase()
    }

    return res.charAt(0).toUpperCase() + res.slice(1)
  }
}

const abc = _.capitalize('FRED')
const abc2 = _.capitalize('__FOO_BAR__')
console.log(abc)
console.log(abc2)
