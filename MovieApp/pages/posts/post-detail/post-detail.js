//获取../../data/posts-data.js中定义的数据
var postsData = require("../../../data/posts-data.js");

//获取app.js中的全局变量
var app=getApp();


Page({

  data:{

  },

  onLoad:function(option){
    //接收要展示的文章Id
    var postid=option.id;
    //将这个文章id放入data
    this.setData({
      "currentPostId": postid
    });
    //从全部的数据中筛选出文章id所对应的内容
    var postData=postsData.postsList[postid];
    this.setData(
      {
        "postData": postData
      }
    );

    //查看缓存中该文章id所对应的收藏信息
    var postsCollected=wx.getStorageSync("posts_collected");
    if (postsCollected){
      var postCollected = postsCollected[postid];
      this.setData({
        "collected":postCollected
      });
    }else{
      var postsCollected={};
      postsCollected[postid]=false;
      wx.setStorageSync("posts_collected", postsCollected);
    }


    //音乐播放相关
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.currentPostId){
        this.setData({
          "isPlayingMusic": true
        });
    }
    //关于音乐播放/停止总控开关的监听事件（改变isPlayingMusic变量)
    this.setMusicMonitor();
    
  },

  //关于音乐播放/停止总控开关的监听事件（改变isPlayingMusic变量)
  setMusicMonitor:function(){
      var that = this;
      //音乐播放事件监听器
      wx.onBackgroundAudioPlay(function () {
        that.setData({
          "isPlayingMusic": true
        });
        app.globalData.g_isPlayingMusic=true;
        app.globalData.g_currentMusicPostId = that.data.currentPostId;
      });
      //音乐暂停事件监听器
      wx.onBackgroundAudioPause(function () {
        that.setData({
          "isPlayingMusic": false
        });
        app.globalData.g_isPlayingMusic = false;
        app.globalData.g_currentMusicPostId = null;
      });
      //音乐播放停止事件监听器
      wx.onBackgroundAudioStop(function () {
        that.setData({
          "isPlayingMusic": false
        });
        app.globalData.g_isPlayingMusic = false;
        app.globalData.g_currentMusicPostId = null;
      });
  },

  //点击音乐播放按钮
  onMusicTap: function () {
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.postData.music.url,
        title: this.data.postData.music.title,
        coverImgUrl: this.data.postData.music.coverImg
      })
    }
  },

  //点击收藏图标，将该文章id所对应的是否收藏状态更改，1.更新缓存 2.setData到视图层
  onCollectionTap:function(){
      var postsCollected=wx.getStorageSync("posts_collected");
      var postCollected = postsCollected[this.data.currentPostId];
      //收藏变成未收藏,未收藏变成收藏
      postCollected = !postCollected;
      postsCollected[this.data.currentPostId]=postCollected;

      //更新文章是否收藏的值
      wx.setStorageSync("posts_collected", postsCollected);
      //更新数据绑定变量，从而实现切换图片
      this.setData({
        "collected": postCollected
      });

      wx.showToast({
        title:postCollected?"收藏成功":"取消收藏",
        duration:1000,
        icon:"success"
      })
  },

  //点击分享图标
  onShareTap:function(){
    var itemList=["分享到微信","分享到朋友圈","分享到QQ","分享到微博"];
    wx.showActionSheet({
      itemList:itemList,
      itemColor:"#405f80",
      success:function(res){
        wx.showModal({
          title:"您点击了"+itemList[res.tapIndex],
          content:"该功能还未实现"
        })
      }
    })
  },


})