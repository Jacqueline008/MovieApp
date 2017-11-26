//获取../../data/posts-data.js中定义的数据
var postsData=require("../../data/posts-data.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData(
      {
        "posts_key": postsData.postsList
      }
    );

  },

  // 点击一篇文章，跳转到相应文章详情页面
  onPostTap:function(event){
    var postid=event.currentTarget.dataset.postid;
    
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postid,
    })

  },

  //点击swiper组件里的swiper-item的Image,跳转到相应文章详情页面
  onSwiperTap:function(event){
    var postid = event.target.dataset.postid;

    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postid,
    })
  }

  
})