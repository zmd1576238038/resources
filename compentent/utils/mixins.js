/*
 * @Description: 全局mixins
 * @Author: LiuZhen
 * @Date: 2018-06-08 19:13:54
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-06-20 10:33:10
 */
import { handleImgAddr } from '@/utils/utils'

export const handleImgMixin = {
  methods: {
    handleImgAddress (imgAddr, isAvatar) {
      return handleImgAddr(imgAddr, isAvatar)
    }
  }
}

export const concatUrlMixin = {
  methods: {
    concatUrl (moduleName, id) {
      return `/${moduleName}/${id}`
    }
  }
}




