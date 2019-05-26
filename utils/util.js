var api = require('../config/api.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        //请求头可以携带Token
        'Authorization': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {
             resolve(res.data);
        } else if (res.statusCode == 401) {
          //需要登录后才可以操作
          let code = null;
          return login().then((res) => {
            code = res.code;
            return getUserInfo();
          }).then((userInfo) => {
            //登录远程服务器
            request(api.AuthLoginByWeixin, { code: code, userInfo: userInfo }, 'POST').then(res => {
              if (res.err === 0) {
                //存储用户信息
                wx.setStorageSync('userInfo', res.data.userInfo);
                wx.setStorageSync('token', res.data.token);

                resolve(res);
              } else {
                reject(res);
              }
            }).catch((err) => {
              reject(err);
            });
          }).catch((err) => {
            reject(err);
          })
        }else{
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

function get(url, data = {}) {
  return request(url, data, 'GET')
}

function post(url, data = {}) {
  return request(url, data, 'POST')
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

module.exports = {
  formatTime,
  request,
  get,
  post,
}
