// pages/home/home.js
Page({
  data: {
    tabIndex: 0,
    findData: null,
    channelData: [],
    dayCover:null,
    showDate:false,
    animation1:{},
    animation2:{}
  },
  tabtoggle(e) {
    this.setData({
      tabIndex: e.detail
    })
  },

  getDayCover(e){
    this.setData({
      dayCover:e.detail,
      showDate:true
    })
    this.start();
    console.log("ayCover==>",this.data.dayCover);
  },

  hiddenDate(){
    this.setData({
      showDate:false
    })
    this.start1()
  },

  //动画
  start(){
    let animation1 = wx.createAnimation({
      delay: 0,
      duration: 1000,
      timingFunction: "linear",
      transformOrigin: '50% 50%',
    })
    animation1.opacity(0).step();
    this.setData({
      animation1:animation1.export()
    })
    let animation2 = wx.createAnimation({
      delay: 0,
      duration: 1000,
      timingFunction: "linear",
      transformOrigin: '50% 50%',
    })
    animation2.opacity(1).step();
    this.setData({
      animation2:animation2.export()
    })
  },

  start1(){
    let animation2 = wx.createAnimation({
      delay: 0,
      duration: 1000,
      timingFunction: "linear",
      transformOrigin: '50% 50%',
    })
    animation2.opacity(0).step();
    this.setData({
      animation2:animation2.export()
    })
    let animation1 = wx.createAnimation({
      delay: 0,
      duration: 1000,
      timingFunction: "linear",
      transformOrigin: '50% 50%',
    })
    animation1.opacity(1).step();
    this.setData({
      animation1:animation1.export()
    })

  },

  //获取发现页面的数据
  searchFindData(e) {
    // 先去本地拿
    var cachedFindData = wx.getStorageSync('findData')

    if (cachedFindData) {
      cachedFindData = JSON.parse(cachedFindData)
    }
    if (cachedFindData.expires > Date.now()) {
      // 还没过期
      this.setData({
        findData: cachedFindData.data
      })
      console.log(this.data.findData);
    } else {
      wx.request({
        url: 'https://app.vmovier.com/apiv3/index/index',
        success: (res) => {
          if (res.data.data) {
            wx.setStorage({
              data: JSON.stringify({
                expires: Date.now() + 1 * 60 * 60 * 1000,
                data: res.data.data
              }),
              key: 'findData'
            })
            this.setData({
              findData: res.data.data
            })
          }
        }
      })
    }
  },

  //获取频道页面的数据
  searchChannelData(e) {
    // 先去本地拿
    var cachedChannelData = wx.getStorageSync('channelData')
    if (cachedChannelData) {
      cachedChannelData = JSON.parse(cachedChannelData)
    }
    if (cachedChannelData.expires > Date.now()) {
      // 还没过期
      this.setData({
        channelData: cachedChannelData.data
      })
    } else {
      wx.request({
        url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/cate/getList',
        success: (res) => {
          if (res.data.data) {
            wx.setStorage({
              data: JSON.stringify({
                expires: Date.now() + 1 * 60 * 60 * 1000,
                data: res.data.data
              }),
              key: 'channelData'
            })
            this.setData({
              channelData: res.data.data
            })
            console.log(this.data.channelData);
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.searchFindData();
    this.searchChannelData();
    this.start1();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})