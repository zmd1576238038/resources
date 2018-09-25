/*
 * @Description: 工具集
 * @Author: cb
 * @Date: 2018-05-31
 * @Last Modified time: 2018-6-1
 */
export default {
  //定义hash对应的模块
  config:{
    '':'MyTreasure',
    '#shift':'Shift',
    '#roll_out':'RollOut',
    '#column':'MyColumn',
    '#comment':'MyComment',
    '#collect':'MyCollect',
    '#account':'Account'
  },
  redirect(hash){
    location.href = location.href.split('#')[0] + hash
  }
}
