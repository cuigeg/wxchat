const app = getApp();
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
// pages/advert/advert.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countdown: 5,
    time: '',
    status: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        if (res.errMsg === 'login:ok') {
          wx.request({
            //由于onLaunch事件加载比较早，所以此处不能使用api组件
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            url: api.AuthLogin,
            data: {
              js_code: res.code,
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              if (res.data.code == 0) {
                wx.setStorage({
                  key: "token",
                  data: res.data.data.token,
                });
                app.globalData.openid = res.data.data.openid;
              }
            }
          });
        } else {
          //刷新页面
          that.onload();
        }

      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo;
              that.setData({
                status: 2
              })
            }
          })
        } else {
          that.setData({
            status: 3
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var time1 = setInterval(function () {
      that.setData({
        countdown: that.data.countdown - 1
      })
      if (that.data.countdown == 0) {
        clearInterval(time1);
        if(that.data.status == 2){
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }else{
          wx.reLaunch({
            url: '/pages/authorize/authorize',
          })
        }
      }
    },1000);
    that.setData({
      time: time1
    })
  },
  
  // 跳过广告
  skip:function(e){
    clearInterval(this.data.time);
    if (this.data.status == 2) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else {
      wx.reLaunch({
        url: '/pages/authorize/authorize',
      })
    }
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