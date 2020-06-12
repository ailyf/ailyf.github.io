// pages/search/search.js
Page({
  data: {
    value: "",
    searchData: null,
    mySearchDate: null,
    historySearch: [],
    showHot: true
  },

  getSearchData() {
    // 先去本地拿
    var cachedSearchData = wx.getStorageSync('searchData')

    if (cachedSearchData) {
      cachedSearchData = JSON.parse(cachedSearchData)
    }
    if (cachedSearchData.expires > Date.now()) {
      // 还没过期
      this.setData({
        searchData: cachedSearchData.data
      })

      console.log(this.data.searchData);
    } else {
      wx.request({
        url: 'https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/search',
        success: (res) => {
          if (res.data.data) {
            wx.setStorage({
              data: JSON.stringify({
                expires: Date.now() + 24 * 60 * 60 * 1000,
                data: res.data.data
              }),
              key: 'searchData'
            })
            this.setData({
              searchData: res.data.data
            })
            console.log("searchData", this.data.searchData);
          }
        }
      })
    }
  },

  toOnly(arr, value) {
    if (arr.indexOf(value) == -1) {
      arr.unshift(value);
    }
  },

  onSearch() {

    if (this.data.value == '') return

    var cachedhistorySearch = wx.getStorageSync('historySearch')
    if (cachedhistorySearch) {
      // cachedhistorySearch = JSON.parse(cachedhistorySearch)
      if (cachedhistorySearch.expires > Date.now()) {
        // if (cachedhistorySearch.data.length != 0) {
        this.toOnly(cachedhistorySearch.data, this.data.value)
        // }
        this.setData({
          historySearch: cachedhistorySearch.data
        })
        console.log(this.data.historySearch);
      }
    } else {
      var historyData = []
      wx.setStorage({
        data: JSON.stringify({
          expires: Date.now() + 24 * 60 * 60 * 1000,
          data: historyData.unshift(this.data.value)
        }),
        key: 'historySearch'
      })
      this.setData({
        mySearchDate: this.data.value
      })
      console.log("mySearchDate", this.data.mySearchDate);
    }


    this.setData({
      showHot: false
    })
    // 先去本地拿
    var cachedmySearchDate = wx.getStorageSync('mySearchDate' + this.data.value)
    if (cachedmySearchDate) {
      cachedmySearchDate = JSON.parse(cachedmySearchDate)
    }
    if (cachedmySearchDate.expires > Date.now()) {
      // 还没过期
      this.setData({
        mySearchDate: cachedmySearchDate.data
      })

      console.log(this.data.mySearchDate);
    } else {
      wx.request({
        url: `https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/search?kw=${this.data.value}`,
        success: (res) => {
          wx.setStorage({
            data: JSON.stringify({
              expires: Date.now() + 24 * 60 * 60 * 1000,
              data: res.data.data
            }),
            key: 'mySearchDate' + this.data.value
          })
          this.setData({
            mySearchDate: res.data.data
          })
        }
      })
    }
  },

  searchHot(e) {
    console.log("e==>", e);
    this.setData({
      value: e.currentTarget.dataset.kw
    })
    this.onSearch();
  },

  onCancel() {
    wx.navigateBack({
      delta: 1
    })
  },

  onLoad: function (options) {
    this.getSearchData();

    var cachedhistorySearch = wx.getStorageSync('historySearch')
    if (cachedhistorySearch) {
      cachedhistorySearch = JSON.parse(cachedhistorySearch)
    }
    if (cachedhistorySearch.expires > Date.now()) {
      // 还没过期
      this.setData({
        historySearch: cachedhistorySearch.data
      })

      console.log(this.data.historySearch);
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})