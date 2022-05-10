// pages/detail/detail.js
import CryptoJS from 'crypto-js'
import CusBase64 from '../../utils/Base64'

const audio = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    APPID: 'a81a3d5e',
    API_SECRET: 'YzViODNmZDg5MDQ4MWM1YjRjYjc4NTA4',
    API_KEY: '4906e805e4086d36955d5f203c6007d5',
    host: '0.0.0.0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const that = this
    // wx.getLocalIPAddress({
    //   success(res) {
    //     that.setData({
    //       host: res.localip
    //     })
    //   }
    // })
    audio.src = './hitoy.mp3'
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  test() {
    console.log('点击测试');
    this.getWebsocketUrl().then(url => {
      console.log('开始连接', url);
      wx.connectSocket({
        url,
        header: {
          'content-type': 'application/json'
        }
      })
      // 打开监听
      wx.onSocketOpen(() => {
        console.log("websocket连接已打开");
        setTimeout(() => {
          send()
        }, 2000)
      })
      // 失败监控
      wx.onSocketError((result) => {
        console.log("websocket连接失败", result);
      })
      // 关闭监听
      wx.onSocketClose(() => {
        console.log('websocket连接已关闭');
      })
      // 监听服务器的数据返回
      wx.onSocketMessage((result) => {
        console.log("服务器的数据返回", result);
        const data = JSON.parse(result.data)
        console.log(97, data.data.audio);
        audio.src = data.data.audio
        // this.setData({
        //   src: data.data.audio
        // })
      })
      // 发送数据
      const send = () => {
        const params = {
          common: {
            app_id: this.data.APPID
          },
          business: {
            aue: 'lame',
            sfl: 1,
            auf: 'audio/L16;rate=16000',
            vcn: 'xiaoyan',
            speed: 50,
            volume: 50,
            pitch: 50,
            bgs: 1,
            tte: 'UTF8'
          },
          data: {
            status: 2,
            text: CusBase64.encoder('123')
          }
        }
        const json = JSON.stringify(params)
        console.log('发送消息');
        console.log(json);
        wx.sendSocketMessage({
          data: json
        })
      }
    })
  },
  /**
   * 获取长连接路径
   * 20220510 yyshu
   */
  getWebsocketUrl() {
    return new Promise(callback => {
      let url = 'wss://tts-api.xfyun.cn/v2/tts'
      const apiKey = this.data.API_KEY
      const apiSecret = this.data.API_SECRET
      const host = this.data.host
      const date = new Date().toGMTString()
      const algorithm = 'hmac-sha256'
      const headers = 'host date request-line'
      const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`
      const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
      const signature = CryptoJS.enc.Base64.stringify(signatureSha)
      const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
      const authorization = CusBase64.encoder(authorizationOrigin)
      url += `?authorization=${authorization}&date=${date}&host=${host}`
      callback(url)
    })
  },
  start() {
    console.log('点击播放')
    audio.onPlay(() => {
      console.log('开始播放160')
    })
    audio.onError(e => {
      console.log('错误', e);
    })
    audio.onCanplay(() => {
      console.log('开始播放166');
      audio.play()
    })
  }
})