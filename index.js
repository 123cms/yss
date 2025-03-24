import { testAPIConnection, analyzeImage, imageToBase64 } from '../../utils/api.js';
import { API_KEY } from '../../utils/api.js';

Page({
  data: {
    imagePath: '',
    videoPath: '',
    isLoading: false,
    animationStyles: [
      { id: 'cartoon', name: '卡通风格' },
      { id: 'realistic', name: '写实风格' },
      { id: 'pixar', name: 'Pixar风格' }
    ],
    selectedStyle: 'cartoon',
    duration: 5, // Default duration in seconds
    emotionOptions: [
      { id: 'happy', name: '开心' },
      { id: 'excited', name: '兴奋' },
      { id: 'playful', name: '顽皮' }
    ],
    selectedEmotion: 'happy'
  },

  onLoad: function(options) {
    if (options.imagePath) {
      this.setData({
        imagePath: options.imagePath
      });
    }
  },

  // Select image from album or camera
  chooseImage: function() {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          imagePath: res.tempFiles[0].tempFilePath,
          videoPath: '' // Reset video when new image is selected
        });
        // Detect if image contains animals
        that.detectAnimal(res.tempFiles[0].tempFilePath);
      }
    });
  },

  // Detect if the image contains an animal
  detectAnimal: function(imagePath) {
    const that = this;
    this.setData({ isLoading: true });
    
    wx.showLoading({ title: '检测中...' });
    
    // Call the API to detect animals in the image
    wx.uploadFile({
      url: getApp().globalData.apiBaseUrl + '/detect-animal',
      filePath: imagePath,
      name: 'image',
      success: function(res) {
        const result = JSON.parse(res.data);
        if (result.hasAnimal) {
          wx.hideLoading();
          wx.showToast({
            title: '检测到' + result.animalType,
            icon: 'success'
          });
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '未检测到动物',
            content: '请上传包含清晰动物形象的图片',
            showCancel: false
          });
        }
      },
      fail: function(error) {
        wx.hideLoading();
        wx.showModal({
          title: '检测失败',
          content: '请检查网络连接后重试',
          showCancel: false
        });
        console.error('Animal detection failed:', error);
      },
      complete: function() {
        that.setData({ isLoading: false });
      }
    });
  },

  // Change animation style
  changeStyle: function(e) {
    this.setData({
      selectedStyle: e.detail.value
    });
  },

  // Change emotion type
  changeEmotion: function(e) {
    this.setData({
      selectedEmotion: e.detail.value
    });
  },

  // Change video duration
  changeDuration: function(e) {
    this.setData({
      duration: e.detail.value
    });
  },

  // Generate the animation video
  generateVideo: function() {
    if (!this.data.imagePath) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      });
      return;
    }

    const that = this;
    this.setData({ isLoading: true });
    
    wx.showLoading({ title: '生成中，请耐心等待...' });
    
    // Call the API to generate the animation
    wx.uploadFile({
      url: getApp().globalData.apiBaseUrl + '/generate-animal-animation',
      filePath: that.data.imagePath,
      name: 'image',
      formData: {
        style: that.data.selectedStyle,
        duration: that.data.duration,
        emotion: that.data.selectedEmotion
      },
      success: function(res) {
        const result = JSON.parse(res.data);
        if (result.success) {
          that.setData({
            videoPath: result.videoUrl
          });
          wx.hideLoading();
          wx.showToast({
            title: '生成成功',
            icon: 'success'
          });
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '生成失败',
            content: result.message || '请稍后重试',
            showCancel: false
          });
        }
      },
      fail: function(error) {
        wx.hideLoading();
        wx.showModal({
          title: '生成失败',
          content: '请检查网络连接后重试',
          showCancel: false
        });
        console.error('Video generation failed:', error);
      },
      complete: function() {
        that.setData({ isLoading: false });
      }
    });
  },

  // Save video to album
  saveVideo: function() {
    if (!this.data.videoPath) {
      wx.showToast({
        title: '请先生成视频',
        icon: 'none'
      });
      return;
    }

    wx.saveVideoToPhotosAlbum({
      filePath: this.data.videoPath,
      success: function() {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
      },
      fail: function() {
        wx.showModal({
          title: '保存失败',
          content: '请确认已授权保存到相册权限',
          showCancel: false
        });
      }
    });
  },

  // Preview the generated video
  previewVideo: function() {
    if (!this.data.videoPath) {
      wx.showToast({
        title: '请先生成视频',
        icon: 'none'
      });
      return;
    }
    
    // Open the video in full screen mode
    wx.openVideoEditor({
      filePath: this.data.videoPath,
      success: function(res) {
        console.log('Video opened successfully');
      }
    });
  }
});