// utils/api.js

// Base API URL
const API_BASE_URL = 'sk-thlaugimgrujpwfwtovrmjjyitvhtiefjxjeqkurvthfagdb';

// Upload image to server
function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: API_BASE_URL + '/upload-image',
      filePath: filePath,
      name: 'image',
      success: (res) => {
        const data = JSON.parse(res.data);
        resolve(data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// Detect animal in the image
function detectAnimal(filePath) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: API_BASE_URL + '/detect-animal',
      filePath: filePath,
      name: 'image',
      success: (res) => {
        const data = JSON.parse(res.data);
        resolve(data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// Generate animal animation from image
function generateAnimalAnimation(filePath, options) {
  const { style, duration, emotion } = options;
  
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: API_BASE_URL + '/generate-animal-animation',
      filePath: filePath,
      name: 'image',
      formData: {
        style,
        duration,
        emotion
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        resolve(data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// Get processing status
function getProcessingStatus(taskId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: API_BASE_URL + '/processing-status',
      data: { taskId },
      method: 'GET',
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

module.exports = {
  uploadImage,
  detectAnimal,
  generateAnimalAnimation,
  getProcessingStatus
};