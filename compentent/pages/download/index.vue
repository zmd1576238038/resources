<template>
  <div class="appDownloadwrap">
    <div class="pc">
      <div class="top"></div>
      <div class="bg">
        <div class="device">
          <span @click="appAndroidDown" class="an"><i></i>Android下载</span>
          <span class="ios" @click="appIosDown"><i></i>iPhone下载</span>
        </div>
      </div>
      <div class="content"></div>
      <div class="fastnews"></div>
      <div class="detail"></div>
    </div>
    <div class="h5">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="logo"></div>
            <div class="words"></div>
            <div class="btn" @click="appDown"><span >下载APP</span></div>
            <div class="down swiper-button-next"></div>
          </div>
          <div class="swiper-slide">
            <div class="pic"></div>
            <div class="words"></div>
            <div class="btn" @click="appDown"><span >下载APP</span></div>
            <div class="down swiper-button-next"></div>
          </div>
          <div class="swiper-slide">
            <div class="pic"></div>
            <div class="words"></div>
            <div class="btn"  @click="appDown"><span>下载APP</span></div>
            <div class="down swiper-button-next"></div>
          </div>
          <div class="swiper-slide">
            <div class="pic">
              <div id="circle"></div>
            </div>
            <div class="words"></div>
            <div class="btn" @click="appDown"><span >下载APP</span></div>
            <div class="copy">成都千氪网络科技有限公司</div>
          </div>
        </div>
        <div class="down swiper-button-next"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import Swiper from 'swiper'
  export default {
    layout:'login',
    methods: {
      appDown() {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        if(isiOS){
          window.location.href = 'https://itunes.apple.com/cn/app/千氪-每日为你提供高质量资讯/id1381042034?l=zh&ls=1&mt=8'
        }else if(isAndroid){
          window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kgtech.kg'
        }
      },
      appAndroidDown(){
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kgtech.kg'
      },
      appIosDown(){
        window.location.href = 'https://itunes.apple.com/cn/app/千氪-每日为你提供高质量资讯/id1381042034?l=zh&ls=1&mt=8'
      }
    },
    mounted() {
      var swiper = new Swiper(".swiper-container", {
        direction: "vertical",
        hideOnClick: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .swiper-container-vertical>.swiper-pagination-bullets{display: none;}
  @media only screen and (max-width: 1920px) {
    .bg {
      height: 813px !important;
    }
    .content, .fastnews, .detail {
      height: 803px!important;
    }
  }
  @media only screen and (max-width: 1800px) {
    .bg {
      height: 813px !important;
    }
    .content, .fastnews, .detail {
      height: 803px!important;
    }
  }
  @media only screen and (max-width: 1700px) {
    .bg {
      height: 813px !important;
    }
    .content, .fastnews, .detail {
      height: 803px!important;
    }
  }
  @media only screen and (max-width: 1600px) {
    .bg {
      height: 678px !important;
    }
    .content, .fastnews, .detail {
      height: 670px!important;
    }
  }
  @media only screen and (max-width: 1440px) {
    .bg {
      height: 610px !important;
    }
    .content, .fastnews, .detail {
      height: 602px!important;
    }
  }
  @media only screen and (max-width: 1366px) {
    .bg {
      height: 578px !important;
    }
    .content, .fastnews, .detail {
      height: 570px !important;
    }
  }
  @media only screen and (max-width: 1280px) {
    .bg {
      height: 542px !important;
    }
    .content, .fastnews, .detail {
      height: 536px !important;
    }
  }
  //
  @media only screen and (min-width: 801px) {
    .appDownloadwrap {
      width: 100%;
      .h5 {
        display: none;
      }
      .pc {
        .top {
          height: 70px;
          background-image: url("https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/top2.png");
        }
        .bg {
          height:  813px;
          background-image: url("https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/textbg3.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          position: relative;
          .device {
            position: absolute;
            bottom: 60px;
            text-align: center;
            width: 100%;
            // .an{margin-right: 59px;}
            .an,.ios {
              display: inline-block;
              width: 273px;
              height: 78px;
              border: 1px solid #fff;
              border-radius: 40px;
              color: #fff;
              font-size: 24px;
              margin-left:20px;
              font-family: 'font-family:PingFangSC-Regular' !important;
              &:hover {
                cursor: pointer;
              }
              i {
                display: inline-block;
                width: 39px;
                height: 48px;
                background-repeat: no-repeat;
                background-size: contain;
                position: relative;
                top: 15px;
                left: -19px;
              }
            }
            .an i {
              background-image: url("https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/an3.png");
            }
            .ios i {
              width: 42px;
              background-image: url("https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/ios3.png");
            }
          }
        }
        .content {
          height: 803px;
          background-image: url("https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/content3.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .fastnews {
          height: 803px;
          background-image: url("https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/fastnews3.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .detail {
          height: 803px;
          background-image: url("https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/detail3.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
      }
    }
  }
  @media only screen and (max-width: 800px) {
    .appDownloadwrap {
      width: 100%;
      height: 100%;
      .pc {display: none;}
      .down {
        width: 16px;
        height: 9px;
        background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/down3.png');
        margin:  0 auto;
        background-size: cover;
        &:focus{
          outline: none;
        }
      }
      .btn {
        width:210px;
        height:42px;
        border: 1px solid #fff;
        border-radius: 22px;
        margin: 0 auto;
        text-align: center;
        span{
          font-size:18px;
          font-family:'PingFangSC-Regular';
          color:rgba(255,255,255,1);
          line-height: 42px;
        }
      }
    }
    html,body {
      position: relative;
      height: 100%;
    }
    .swiper-container, .h5 {
      width: 100%;
      height: 100%;
    }
    .swiper-slide {
      &:first-child {
        background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/bg3.png');
        background-size: cover;
        background-repeat: no-repeat;
        .logo{
          width: 180px;
          height: 180px;
          background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/logo3.png');
          background-size: contain;
          margin: 0 auto;
          position: relative;
          top: 30px;
        }
        .words {
          height: 72px;
          background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/words3.png');
          background-size: contain;
          width: 282px;
          margin: 0 auto;
          margin-top: 50px;
        }
      }
      &:nth-child(2) {
        background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/2bg3x.png');
        background-size: cover;
        background-repeat: no-repeat;
        .pic{
          height: 400px;
          width: 270px;
          background-repeat: no-repeat;
          background-size: cover;
          background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/White3x.png');
          margin:  0 auto;
        }
        .words{
          height: 55px;
          width: 224px;
          background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/2words3x.png');
          background-size: contain;
          margin:  0 auto;
        }
      }
      &:nth-child(3) {
        background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/fbg3.png');
        background-size: cover;
        background-repeat: no-repeat;
        .pic {
          height: 400px;
          width: 284px;
          background-repeat: no-repeat;
          background-size: cover;
          background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/fWhite3x.png');
          margin:  0 auto;
          position: relative;
          #circle{
            position: absolute;
            width: 184px;
            height: 184px;
            border-radius: 50%;
            background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/circle3.png');
            right: 0;
            bottom: 40px;
          }
        }
        .words{
          height: 55px;
          width: 224px;
          background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/f3x.png');
          background-size: contain;
          background-repeat: no-repeat;
          margin:  0 auto;
        }
      }
      &:nth-child(4) {
        background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/4bg3x.png');
        background-size: cover;
        background-repeat: no-repeat;
        .pic {
          height: 420px;
          width: 300px;
          margin-top: -20px;
          background-repeat: no-repeat;
          background-size: cover;
          background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/zu3.png');
          // background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/wWhite3x.png');
          margin:  0 auto;
          position: relative;
          #circle{
            position: absolute;
            width: 184px;
            height: 184px;
            border-radius: 50%;
            background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/circle3.png');
            right: -18px;
            bottom: 40px;
            background-size: 100%;
          }
        }
        .words{
          height: 55px;
          width: 180px;
          background-image: url('https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/180424/h5/4words3x.png');
          background-size: contain;
          background-repeat: no-repeat;
          margin:  0 auto;
        }
      }
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      -webkit-justify-content: space-around;
      justify-content: space-around;
      .copy{color: #fff;font-size: 12px;font-family: 'font-family:PingFangSC-Light'; margin:  0 auto;text-align: center;}
    }
    .swiper-button-next{
      position: static;
    }
  }
  @media only screen and (min-width: 414px) {
    .swiper-slide {
      &:nth-child(2) {
        .pic{
          height: 420px;
          width: 280px;
        }
      }
      &:nth-child(3) {
        .pic {
          height: 430px;
          width: 300px;
        }
      }
      &:nth-child(4) {
        .pic {
          height: 460px;
          width: 330px;
        }
      }
    }
  }
  @media only screen and (min-width: 768px) {
    .appDownloadwrap .btn{
      width: 420px;
      height: 84px;
      border-radius: 44px;
      span{
        font-size: 36px;
        line-height: 84px;
      }
    }
    .swiper-slide {
      &:nth-child(1) {
        background-size: 100% 100%;
        .logo{width: 360px;height: 360px;}
        .words{height: 144px;width: 564px;}
      }
      &:nth-child(2) {
        background-size: 100% 100%;
        .pic{
          height: 740px;
          width: 500px;
        }
        .words {
          height: 110px;
          width: 448px;
        }
      }
      &:nth-child(3) {
        background-size: 100% 100%;
        .pic {
          height: 740px;
          width: 500px;
        }
        .words {
          height: 110px;
          width: 448px;
        }
      }
      &:nth-child(4) {
        background-size: 100% 100%;
        .pic {
          height: 720px;
          width: 500px;
        }
        .words {
          height: 110px;
          width: 448px;
        }
        .copy{font-size: 24px;}
      }
    }
  }
</style>
