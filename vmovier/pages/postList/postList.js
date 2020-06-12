// pages/postList/postList.js
Page({

  data: {
    postListParams: null,
    postListData: [],
    kW:null,
    url: ''
  },
  onClickLeft() {
    wx.navigateBack({
      delta: 1
    })
  },

  getpostListData() {
    // if(this.data.kW==''){return}
    // // 先去本地拿
    // var cachedpostListData = wx.getStorageSync('findData' + this.data.kW)
    // if (cachedpostListData) {
    //   cachedpostListData = JSON.parse(cachedpostListData)
    // }
    // if (cachedpostListData.expires > Date.now()) {
    //   // 还没过期
    //   this.setData({
    //     postListData: cachedpostListData.data
    //   })
    // } else {
      wx.request({
        url: this.data.url,
        success: (res) => {
          if (res.data.data) {
            // wx.setStorage({
            //   data: JSON.stringify({
            //     expires: Date.now() + 1 * 60 * 60 * 1000,
            //     data: res.data.data
            //   }),
            //   key:'findData' + this.data.kW  
            // })
            this.setData({
              postListData: res.data.data
            })
          }
        }
      })
    // }
  },

  onLoad: function (options) {
    console.log(options);
    this.setData({
      postListParams: options
    })
    if (this.data.postListParams.tab) {
      this.setData({
        kW: this.data.postListParams.tab,
        url:`https://app.vmovier.com/apiv3/post/getPostByTab?p=1&size=10&tab=${this.data.postListParams.tab}`
      })
    } else {
      this.setData({
        kW: this.data.postListParams.cateid,
        url : `https://app.vmovier.com/apiv3/post/getPostInCate?p=1&size=10&cateid=${this.data.postListParams.cateid}`
      })
    }
    this.getpostListData()
  },

  onReady: function () {

  },

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