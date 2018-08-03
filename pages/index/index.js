const app = getApp();

Page({
  data: {
    userInfo: null,
  },
  onLoad: function (options) {
    var that = this;
      that.setData({
        userInfo: app.globalData.userInfo
      });
  },
  onShow: function () {
    wx.setNavigationBarTitle({ 
      title: '小柒商城'
    });
  },
  about: function (e) {
    wx.showModal({
      title: '提示',
      content: app.globalData.about || '',
      showCancel: false
    });
  }
});
