// components/tabbar/tabbar.js
Component({

  properties: {

  },

  data: {
    dayCover: null,
  },

  methods: {
    onClick(e) {
      console.log(e);
      this.triggerEvent('tabtoggle', e.detail.index);
    },

    onSearch() {
      wx.navigateTo({
        url: `/pages/search/search?searchData=${this.data.searchData}`,
      })
    },

    onGetDayCover(e) {
      // 先去本地拿
      var cachedDayCover = wx.getStorageSync('dayCover')
      if (cachedDayCover) {
        cachedDayCover = JSON.parse(cachedDayCover)
      }
      if (cachedDayCover.expires > Date.now()) {
        // 还没过期
        this.setData({
          dayCover: cachedDayCover.data
        })
        this.triggerEvent('getDayCover', this.data.dayCover);
      } else {
        wx.request({
          url: 'https://app.vmovier.com/apiv3/DayCover/getDayCover',
          success: (res) => {
            if (res.data.data) {
              wx.setStorage({
                data: JSON.stringify({
                  expires: Date.now() + 0.5 * 60 * 60 * 1000,
                  data: res.data.data
                }),
                key: 'dayCover'
              })
              this.setData({
                dayCover: res.data.data
              })
              console.log(this.data.dayCover);
              this.triggerEvent('getDayCover', this.data.dayCover);
            }
          }
        })
      }
    }
  }
})