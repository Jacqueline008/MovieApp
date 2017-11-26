App({
  
  globalData:{
    //post-detail页面为了切换页面时，音乐播放也能正常的一个全局变量(在post-detail.js中用到)
    //音乐是否正在被播放
    g_isPlayingMusic:false,
    //哪一个音乐正在被播放
    g_currentMusicPostId:null,


    //豆瓣的基本地址
    doubanBase:"https://api.douban.com",
  }

})