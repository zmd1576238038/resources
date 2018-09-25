/*
 * @Description: 意见反馈弹出层组件
 * @Author: LiuZhen
 * @Date: 2018-06-21 17:04:07
 * @Last Modified by: cb
 * @Last Modified time: 2018-08-24 15:24:51
 */
<template>
  <section class="feedback">
    <el-dialog title="意见反馈" :visible="feedbackStatus" @close="close">
      <div class="textarea-text">
        <el-input type="textarea"
                  :rows="5"
                  placeholder="您的意见"
                  v-model="textarea"
                  class="feed-content"
                  @keyup.native="handleCount($event)">
        </el-input>
        <div class="content-count" ref="contentCount">{{currentCount}}/200</div>
      </div>
      <el-input v-model="feedbackPhone" placeholder="请输入您的手机号码" @blur="onBlur"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendFeedback" class="confirm-btn">确认</el-button>
        <el-button type="text" @click.native="close">取消</el-button>
      </div>
    </el-dialog>
    <!-- feedback/addFeedback -->
  </section>
</template>

<script type="text/ecmascript-6">
import axios from '@/plugins/axios'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Feedback',
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      feedbackPhone: '',
      textarea: '',
      currentCount: 0
    }
  },

  computed: {
    ...mapState([
      'feedbackStatus'
    ])
  },

  methods: {
    ...mapMutations([
      'SET_FEEDBACK_STATUS'
    ]),
    sendFeedback () {
      if (!this.textarea || !this.feedbackPhone) {
        this.$message({
          type:'warning',
          message:'请输入反馈信息和您的手机号'
        })
        return
      }
      if(this.textarea && this.textarea.length>200){
        this.$message({
          type:'error',
          message:'反馈字数最多200'
        })
        return false
      }
      axios.post('/feedback/addFeedback', {
        feedbackDetail: this.textarea,
        feedbackPhone: this.feedbackPhone
      }).then(({ data }) => {
        if (data.code === '10000') {
          this.textarea = ''
          this.feedbackPhone = ''
          this.close()
          this.$message({ type: 'success', message: '发送成功' })
        }
      })
    },
    onBlur(){
      let reg=/^[1][3,4,5,7,8][0-9]{9}$/;
      // console.log("11111");
      if(!reg.test(this.feedbackPhone)){
        this.$message({
          type:'warning',
          message:'请输入您正确的手机号码！提示：号码为11位数字'
        })
        return
      }
    },

    close () {
      this.SET_FEEDBACK_STATUS(false)
    },

    // 统计数字
    handleCount (event) {
      this.currentCount = this.textarea.length
      // 如果数量超过200
      if (this.currentCount > 200) {
        this.$refs.contentCount.style.color = '#f30'
      } else {
        this.$refs.contentCount.style.color = '#333'
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../assets/stylus/index.styl'

.feedback
  .el-dialog
    position relative
    width 690px
    padding 30px 40px
    .textarea-text
      position relative
      overflow hidden
      .content-count
        position absolute
        bottom 40px
        right 5px
        display inline-block
        font-size 12px
    div
      padding 0
    .el-dialog__header
      margin-bottom 30px
    .el-dialog__body
      margin-bottom 16px
    .feed-content
      margin-bottom 30px
      textarea
        resize none
    .el-dialog__footer
    .dialog-footer
      text-align left
      .confirm-btn
        width 170px
</style>
