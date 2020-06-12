// components/Detail/Detail.js
Component({
  properties: {
    detailData: Object,
  },
  data: {
    isLike: false,
    likeData: [],
    historyData: []
  },
  methods: {
    onClick() {
      wx.navigateBack({
        delta: 1
      })
    },
    // toOnly(arr, detailData) {
    //   //过滤重复
    //   let isExist = arr.some(item => {
    //     return item.postid == detailData.postid;
    //   });
    //   if (!isExist) {
    //     this.data.detailData.isLike = true;
    //     arr.unshift(detailData);
    //   }
    // },
    toggleLike() {
      this.setData({
        isLike: !this.data.isLike
      })

      //如果是收藏
      if (this.data.isLike) {
        var cachedLikeData = wx.getStorageSync('likeData')

        //如果存在cookie
        if (cachedLikeData) {
          cachedLikeData = JSON.parse(cachedLikeData).data;
          console.log("cachedLikeData==>", cachedLikeData);
          var likeArray = [];
          likeArray.unshift(this.data.detailData);
          for (let i = 0; i < likeArray.length; i++) {
            likeArray[i].isLike = true;
          }
          console.log('red==>', likeArray);

          // for (let i = 0; i < cachedLikeData.length; i++) {
          //   // const element = array[i];
          //   if (cachedLikeData[i].postid == this.data.detailData.postid) {
          //     this.setData({
          //       detailData: cachedLikeData[i]
          //     })
          //   }else{
          //     likeArray.unshift(this.data.detailData);
          //   }
          // }

          // let isExist = cachedLikeData.some(item => {
          //   return item.postid == this.data.detailData.postid;
          // });
          // if (!isExist) {
          //   this.data.detailData.isLike = true;
          //   cachedLikeData.unshift(this.data.detailData);
          // }

          wx.setStorage({
            data: JSON.stringify({
              data: [...this.data.likeData, ...likeArray]
            }),
            key: 'likeData'
          })
          this.setData({
            likeData: [...this.data.likeData, ...likeArray]
          })
          console.log("likeData==>", this.data.likeData);
        } else {
          //如果不存在cookie
          var likeArray = [];
          likeArray.unshift(this.data.detailData);
          for (let i = 0; i < likeArray.length; i++) {
            likeArray[i].isLike = true;
          }
          wx.setStorage({
            data: JSON.stringify({
              data: [...this.data.likeData, ...likeArray]
            }),
            key: 'likeData'
          })
          this.setData({
            likeData: [...this.data.likeData, ...likeArray]
          })
          console.log("likeData==>", this.data.likeData);
        }
      } else {
        //如果是取消收藏
        var cachedLikeData = wx.getStorageSync('likeData')
        if (cachedLikeData) {
          cachedLikeData = JSON.parse(cachedLikeData).data;
          for (let i = 0; i < cachedLikeData.length; i++) {
            if (cachedLikeData[i].postid == this.data.detailData.postid) {
              cachedLikeData[i].isLike = false;
              cachedLikeData.splice(i, 1);
              this.setData({
                likeData: cachedLikeData
              })
              console.log("likeData==>", this.data.likeData);
            }
          }
          wx.setStorage({
            data: JSON.stringify({
              data: this.data.likeData
            }),
            key: 'likeData'
          })
        }
      }
    }
  },

  lifetimes: {
    created() {
      var cachedLikeData = wx.getStorageSync('likeData')
      if (cachedLikeData) {
        cachedLikeData = JSON.parse(cachedLikeData).data;
        // console.log("cachedLikeData==>", cachedLikeData);
        this.setData({
          likeData: cachedLikeData
        })
        for (let i = 0; i < cachedLikeData.length; i++) {
          // const element = array[i];
          if (cachedLikeData[i].postid == this.data.detailData.postid) {
            this.setData({
              detailData: cachedLikeData[i],
              isLike: cachedLikeData[i].isLike
            })
          }
        }
      }
      console.log('detailDatacreated==>', detailData);

    }
  }
})