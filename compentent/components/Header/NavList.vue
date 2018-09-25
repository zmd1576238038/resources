/*
 * @Description: NavList组件，页头导航列表组件
 * @Author: LiuZhen
 * @Date: 2018-05-28 20:11:10
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-15 15:11:38
 */
<template>
  <section class="header-nav-list">
    <ul>
      <li v-for="(item,index) in navlist" :key="index" v-on:mouseenter="showNextMenu($event)" v-on:mouseleave="hideNextMenu($event)">
        <nuxt-link :to="item.url" :class="isActive(item)?'is-active':''">{{item.name}}</nuxt-link>
        <span v-if="item.nextList" class="nav-second-menu-arrow"></span>
        <div class="second-menu" v-if="item.nextList">
          <span v-for="(secondItem,secondIndex) in item.nextList" :key="secondIndex">
            <nuxt-link :to="secondItem.url">{{secondItem.name}}</nuxt-link>
          </span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'nav-list',
  data () {
    return {
      selectItem:'/',
      navlist: [
        {
          name: '首页',
          url: '/',
          nextClass: false,
          isActive: true
        },
        {
          name: '金融',
          url: '/jinrong',
          nextClass: false,
          isActive: false
        },
        {
          name: '科技',
          url: '/keji',
          nextClass: false,
          isActive: false
        },
        {
          name: '视频',
          url: '/keshipin',
          nextClass: false,
          isActive: false
        },
        {
          name: '快讯',
          url: '/newslist',
          nextClass: false,
          isActive: false
        },
        {
          name: '独家',
          url: '/dujia',
          nextClass: false,
          isActive: false
        },
        {
          name: '活动',
          url: '/huodong',
          nextClass: false,
          isActive: false
        },
        {
          name: '图片',
          url: '/tupian',
          nextClass: false,
          isActive: false
        },
        {
          name: '公告',
          url: '/gonggao',
          nextClass: false,
          isActive: false
        }
      ]
    }
  },
  created(){
    const path = this.$route.path;
    this.selectItem = path
  },
  methods: {
    isActive (item) {
      let {url,nextList} = item
      if(nextList){
       nextList.map(n => {
         if(n.url.indexOf(this.selectItem) !== -1){
           url = n.url
         }
       })
      }
      if(this.selectItem !== '/' && url.indexOf(this.selectItem) !== -1){
        return true
      }else if(url === '/' && this.selectItem === '/'){
        return true
      } else {
        return false
      }
    },

    // 鼠标移入事件
    showNextMenu (event) {
      const secMenuEle = event.target.lastChild
      const iconEle = secMenuEle.previousSibling  // 当前节点的上一个兄弟节点
      if (secMenuEle.nodeType === 1) {
        // 将当前所有兄弟元素的子元素div隐藏
        const subNodes = event.target.parentNode.childNodes
        for (let i = 0; i < subNodes.length; i++) {
          if (subNodes[i].lastChild.nodeType === 1) {
            subNodes[i].lastChild.style.display = 'none'
          }
        }

        secMenuEle.style.display = 'block'
        iconEle.classList.remove('nav-second-menu-arrow')
        iconEle.classList.add('nav-second-menu-arrow-active')
      }
    },

    // 鼠标移出事件
    hideNextMenu (event) {
      const secMenuEle = event.target.lastChild
      const iconEle = secMenuEle.previousSibling  // 当前节点的上一个兄弟节点
      if (secMenuEle.style && secMenuEle.style.display) {
        if (secMenuEle.style.display === 'block') {
          secMenuEle.style.display = 'none'
        }

        iconEle.classList.remove('nav-second-menu-arrow-active')
        iconEle.classList.add('nav-second-menu-arrow')
      }
    }
  },

  watch: {
    $route () {
      const pathName = location.pathname
      this.selectItem = pathName

      // 隐藏所有二级菜单
      // const nextMenus = document.querySelectorAll('.second-menu')
      // for(var i in nextMenus){
      //   i.style.display = 'none'
      // }

    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.header-nav-list
  display inline-block
  height: 100%
  ul
    height 60px
    margin 0
    line-height 60px
    li
      display inline-block
      margin-right 34px
      position relative
      .second-menu
        display none
        position absolute
        top 60px
        left -40px
        width 120px
        height auto
        background-color #fff
        text-align center
        z-index 100
        line-height 40px
        border 1px solid #E6E6E6
        box-shadow 6px 0px 10px rgba(232, 232, 232, .5)
        span
          display inline-block
          width 100%
          a
            font-size 13px
            &:hover
              color $color-text-active
      &:last-child
        margin-right 0
      a
        position relative
        display inline-block
        width 100%
        height 100%
        color $color-text-nav
        font-size $font-size-medium
        &:hover
          color #2382ea
        &.has-second-class
          // &:after
          //   content ''
          //   next-class-tip-icon(3px)
          //   // next-class-tip-icon-active(3px)
          //   position absolute
          //   top 28px
          //   left 32px
        &.is-active
          color $color-text-active
          &:after
            content ''
            position absolute
            bottom 0
            left -1px
            width 100%
            display inline-block
            border 1px solid $color-text-active
      .nav-second-menu-arrow
        position absolute
        top 28px
        left 32px
        next-class-tip-icon()
      .nav-second-menu-arrow-active
        position absolute
        top 28px
        left 32px
        next-class-tip-icon-active()
</style>
