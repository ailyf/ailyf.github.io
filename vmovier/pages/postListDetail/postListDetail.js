// pages/postListDetail/postListDetail.js
Page({
  data: {
    detailId: '',
    detailData:null
  },
  getDetailData() {
    wx.request({
      url: `https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/view?postid=${this.data.detailId}`,
      success: (res) => {
        console.log("res==>",res);
        res.data.data.isLike= false;
        this.setData({
          detailData: res.data.data
        })
        console.log("detailData==>",this.data.detailData);
      }
    })
  },

  onLoad: function (options) {
    // console.log(options);
    this.setData({
      detailId: options.postid
    })
    this.getDetailData();
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

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