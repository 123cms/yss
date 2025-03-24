// app.js
App({
  onLaunch: function () {
    // Check for updates
    this.checkUpdate();
    
    // Initialize user info
    this.initUserInfo();
  },
  
  globalData: {
    userInfo: null,
    apiBaseUrl: 'sk-thlaugimgrujpwfwtovrmjjyitvhtiefjxjeqkurvthfagdb',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName')
  },
  
  checkUpdate: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
          
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本下载失败，请检查网络后重试',
              showCancel: false
            });
          });
        }
      });
    }
  },
  
  initUserInfo: function () {
    if (wx.getUserProfile) {
      this.globalData.canIUseGetUserProfile = true;
    }
  }
});