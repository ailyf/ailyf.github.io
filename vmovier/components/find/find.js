// components/find/find.js
Component({
  properties: {
    findData: Object
  },
  data: {},
  methods: {
    //获取发现页面的数据
    searchFindData(e) {
      wx.request({
        url: 'https://app.vmovier.com/apiv3/index/index',
        enableCache: true,
        success: (res) => {
          this.setData({
            findData: res.data.data
          })
          console.log(this.data.findData);
        }
      })
    }
  }
})